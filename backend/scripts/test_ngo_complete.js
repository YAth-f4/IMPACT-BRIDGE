// backend/scripts/test_ngo_complete.js
const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING COMPLETE NGO REGISTRATION & RBAC VALIDATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Authenticate Admin
    console.log('--- Step 1: Sign In as Admin ---');
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@impactbridge.org',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    });
    assert(adminLogin.status === 200 && adminLogin.body.token, 'Admin authenticated successfully');
    const adminToken = adminLogin.body.token;

    // 2. Register & Authenticate Regular User (Donor / NGO representative)
    console.log('\n--- Step 2: Register & Sign In as NGO Representative (Donor Role) ---');
    const userEmail = `rep.ngo.${Date.now()}@example.com`;
    await request('POST', '/api/auth/register', {
      name: 'Priya Verma',
      email: userEmail,
      password: 'password123',
      role: 'donor'
    });

    const userLogin = await request('POST', '/api/auth/login', {
      email: userEmail,
      password: 'password123'
    });
    assert(userLogin.status === 200 && userLogin.body.token, 'Regular user authenticated successfully');
    const userToken = userLogin.body.token;
    const userId = userLogin.body.user.id;

    // 3. Test Public Directory Initial State
    console.log('\n--- Step 3: Check Public Directory (Approved NGOs only) ---');
    const publicInitial = await request('GET', '/api/ngos');
    assert(publicInitial.status === 200 && publicInitial.body.success, 'Public directory responds with success');
    const initialApprovedCount = publicInitial.body.ngos.length;
    console.log(`Found ${initialApprovedCount} verified seed NGOs in public directory`);
    assert(initialApprovedCount >= 3, 'Seed NGOs (Goonj, Akshaya Patra, Smile Foundation) are present and approved');

    // 4. Test Unauthenticated Guest Registration Attempt
    console.log('\n--- Step 4: Verify Guest Cannot Register NGO Without Authentication ---');
    const guestReg = await request('POST', '/api/ngos/register', {
      organizationName: 'Spoof Foundation',
      registrationNumber: 'FAKE/123/2026',
      contactEmail: 'spoof@fake.org'
    });
    assert(guestReg.status === 401, 'Guest registration is correctly rejected with 401 Unauthorized');

    // 5. Submit Valid NGO Registration as Authenticated Representative
    console.log('\n--- Step 5: Submit Valid NGO Registration as Authenticated User ---');
    const uniqueRegNum = `REG-TEST-${Date.now()}`;
    const newNgoPayload = {
      organizationName: 'Rural Health & Literacy Mission',
      description: 'Dedicated to providing primary healthcare clinics and evening schools in tribal belts.',
      ngoType: 'Trust',
      registrationNumber: uniqueRegNum,
      registrationCertificate: 'data:application/pdf;base64,JVBERi0xLjQKJUZha2VQREZDZXJ0aWZpY2F0ZQo=',
      founder: 'Dr. Ramesh Sharma',
      authorizedRepresentative: 'Priya Verma',
      contactEmail: 'contact@ruralhealthmission.org',
      phone: '+91 98765 43210',
      website: 'https://ruralhealthmission.org',
      address: 'Plot 45, Seva Kendra Marg',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834001',
      causes: ['Healthcare', 'Education'],
      programs: ['Mobile Health Van', 'Tribal Night School'],
      yearsOfOperation: 6,
      agreeDeclaration: true
    };

    const submitRes = await request('POST', '/api/ngos/register', newNgoPayload, userToken);
    assert(submitRes.status === 201 && submitRes.body.success, 'NGO registration submitted successfully');
    const createdNgo = submitRes.body.ngo;
    const ngoId = createdNgo.id;
    console.log(`Created NGO ID: ${ngoId}, Status: ${createdNgo.status}`);
    assert(createdNgo.status === 'PENDING', 'New registration strictly has status PENDING upon creation');
    assert(createdNgo.ownerUserId === userId, 'Registration is properly bound to ownerUserId');

    // 6. Verify Public Directory Isolation (PENDING NGO MUST NOT BE PUBLIC)
    console.log('\n--- Step 6: Verify PENDING NGO Is NOT Visible in Public Directory ---');
    const publicAfterSubmit = await request('GET', '/api/ngos');
    const foundInPublic = publicAfterSubmit.body.ngos.some(n => n.id === ngoId);
    assert(!foundInPublic, 'PENDING NGO is isolated and NOT visible in public directory');
    
    // Also verify direct public GET /api/ngos/:id returns 404
    const publicDetailPending = await request('GET', `/api/ngos/${ngoId}`);
    assert(publicDetailPending.status === 404, 'Direct public access to pending NGO profile returns 404');

    // 7. Verify Owner Portal Access
    console.log('\n--- Step 7: Verify Owner Can View Pending Submission in /api/ngos/my/submissions ---');
    const mySubmissions = await request('GET', '/api/ngos/my/submissions', null, userToken);
    assert(mySubmissions.status === 200 && mySubmissions.body.success, 'Owner submissions endpoint returns 200');
    const myNgo = mySubmissions.body.ngos.find(n => n.id === ngoId);
    assert(myNgo && myNgo.status === 'PENDING', 'Owner correctly sees their PENDING submission');

    // 8. Verify RBAC on Admin Endpoint
    console.log('\n--- Step 8: Verify Regular User CANNOT Access Admin NGO Endpoints ---');
    const userAdminAttempt = await request('GET', '/api/admin/ngos', null, userToken);
    assert(userAdminAttempt.status === 403, 'Regular user is rejected from /api/admin/ngos with 403 Forbidden');

    // 9. Admin Inspection
    console.log('\n--- Step 9: Admin Inspects NGO Registration Queue ---');
    const adminQueue = await request('GET', '/api/admin/ngos?status=PENDING', null, adminToken);
    assert(adminQueue.status === 200 && adminQueue.body.success, 'Admin successfully fetches pending queue');
    const adminFound = adminQueue.body.ngos.find(n => n.id === ngoId);
    assert(adminFound !== undefined, 'Admin sees the new pending NGO in the review queue');

    // 10. Admin Requests Information (NEEDS_INFO)
    console.log('\n--- Step 10: Admin Moves Status to NEEDS_INFO with Review Notes ---');
    const needsInfoRes = await request('PATCH', `/api/admin/ngos/${ngoId}/status`, {
      status: 'NEEDS_INFO',
      reviewNotes: 'Please upload a clearer scan of Section 12A/80G registration certificate.'
    }, adminToken);
    assert(needsInfoRes.status === 200 && needsInfoRes.body.ngo.status === 'NEEDS_INFO', 'Status updated to NEEDS_INFO');
    assert(needsInfoRes.body.ngo.adminReview.reviewNotes.includes('12A/80G'), 'Review notes are stored in adminReview');

    // 11. Owner Resubmits with Clarification
    console.log('\n--- Step 11: Owner Resubmits with Clarifications ---');
    const resubmitRes = await request('POST', `/api/ngos/${ngoId}/resubmit`, {
      revisionNotes: 'Uploaded high resolution 12A/80G gazette document and tax exemption order.'
    }, userToken);
    assert(resubmitRes.status === 200 && resubmitRes.body.ngo.status === 'PENDING', 'Owner resubmission returns status to PENDING');

    // 12. Admin Approves the NGO
    console.log('\n--- Step 12: Admin Approves the NGO ---');
    const approveRes = await request('PATCH', `/api/admin/ngos/${ngoId}/status`, {
      status: 'APPROVED',
      reviewNotes: 'All legal documents and FCRA/12A clearances validated. Welcome to Impact Bridge.'
    }, adminToken);
    assert(approveRes.status === 200 && approveRes.body.ngo.status === 'APPROVED', 'Admin successfully approved NGO');

    // 13. Verify Public Directory NOW Displays the Approved NGO
    console.log('\n--- Step 13: Verify Approved NGO Is Now Publicly Visible in Directory ---');
    const publicAfterApproval = await request('GET', '/api/ngos');
    const foundApproved = publicAfterApproval.body.ngos.find(n => n.id === ngoId);
    assert(foundApproved !== undefined, 'Approved NGO is now live in the public directory!');
    assert(foundApproved && foundApproved.status === 'APPROVED', 'Public NGO has status APPROVED');

    // 14. Verify Public Single NGO Profile Endpoint
    console.log('\n--- Step 14: Verify Public GET /api/ngos/:id Returns Approved Profile ---');
    const publicProfile = await request('GET', `/api/ngos/${ngoId}`);
    assert(publicProfile.status === 200 && publicProfile.body.ngo.organizationName === newNgoPayload.organizationName, 
      'Public profile returns complete NGO details');

    // 15. Verify Duplicate Registration Number Prevention
    console.log('\n--- Step 15: Verify Duplicate Registration Number is Prevented ---');
    const duplicateSubmit = await request('POST', '/api/ngos/register', {
      ...newNgoPayload,
      organizationName: 'Duplicate Attempt Inc'
    }, userToken);
    console.log('Duplicate submit response:', duplicateSubmit.status, duplicateSubmit.body);
    const duplicateMsg = duplicateSubmit.body?.message || duplicateSubmit.body?.error || '';
    assert((duplicateSubmit.status === 409 || duplicateSubmit.status === 400) && duplicateMsg.includes('already been registered'), 
      'Duplicate registration number is prevented with clean error message');

    console.log(`\n==============================================`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`==============================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Unexpected test failure:', err);
    process.exit(1);
  }
}

runTests();
