/**
 * Comprehensive Automated Verification Suite for Impact Bridge Admin Dashboard Backend
 * Verifies all 20 requirements from the user specification.
 */

const http = require('http');
const assert = require('assert');

const BASE_URL = 'http://localhost:5000';

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
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: data });
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

async function runAllTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING ADMIN DASHBOARD BACKEND VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      passed++;
      console.log(`✅ [TEST ${total}] PASS: ${name}`);
    } catch (err) {
      console.error(`❌ [TEST ${total}] FAIL: ${name}`);
      console.error('   Error:', err.message);
      throw err;
    }
  }

  // Helper login
  async function login(email, password) {
    const res = await request('POST', '/api/auth/login', { email, password });
    if (res.status !== 200 || !res.body.token) {
      throw new Error(`Login failed for ${email}: ${JSON.stringify(res.body)}`);
    }
    return res.body.token;
  }

  console.log('Logging in test accounts...');
  const adminToken = await login('admin@impactbridge.org', 'admin123');
  const volunteerToken = await login('aarav.sharma@example.com', 'volunteer123');
  const beneficiaryToken = await login('laxmi.devi@example.com', 'help123');
  const donorToken = await login('aditya.singhania@corp.in', 'donor123');

  // ------------------------------------------------------------------------
  // 1. GUEST ACCESS BLOCKED (401)
  // ------------------------------------------------------------------------
  const guestDashboard = await request('GET', '/api/admin/dashboard');
  test('Guest accessing /api/admin/dashboard returns 401 Unauthorized', () => {
    assert.strictEqual(guestDashboard.status, 401);
    assert.strictEqual(guestDashboard.body.success, false);
  });

  const guestUsers = await request('GET', '/api/admin/users');
  test('Guest accessing /api/admin/users returns 401 Unauthorized', () => {
    assert.strictEqual(guestUsers.status, 401);
  });

  // ------------------------------------------------------------------------
  // 2. NON-ADMIN ROLES BLOCKED (403)
  // ------------------------------------------------------------------------
  const donorAttempt = await request('GET', '/api/admin/dashboard', null, donorToken);
  test('Donor accessing /api/admin/dashboard returns 403 Forbidden', () => {
    assert.strictEqual(donorAttempt.status, 403);
    assert.strictEqual(donorAttempt.body.success, false);
  });

  const volunteerAttempt = await request('GET', '/api/admin/dashboard', null, volunteerToken);
  test('Volunteer accessing /api/admin/dashboard returns 403 Forbidden', () => {
    assert.strictEqual(volunteerAttempt.status, 403);
    assert.strictEqual(volunteerAttempt.body.success, false);
  });

  const beneficiaryAttempt = await request('GET', '/api/admin/dashboard', null, beneficiaryToken);
  test('Beneficiary accessing /api/admin/dashboard returns 403 Forbidden', () => {
    assert.strictEqual(beneficiaryAttempt.status, 403);
    assert.strictEqual(beneficiaryAttempt.body.success, false);
  });

  // ------------------------------------------------------------------------
  // 3. ADMIN ACCESS SUCCEEDS (200)
  // ------------------------------------------------------------------------
  const adminDashboard = await request('GET', '/api/admin/dashboard', null, adminToken);
  test('Admin accessing /api/admin/dashboard returns 200 OK with real metrics', () => {
    assert.strictEqual(adminDashboard.status, 200);
    assert.strictEqual(adminDashboard.body.success, true);
    assert.ok(adminDashboard.body.data, 'Dashboard data object exists');
    assert.ok(adminDashboard.body.data.users, 'Users stats exist');
    assert.ok(adminDashboard.body.data.ngos, 'NGO stats exist');
    assert.ok(adminDashboard.body.data.helpRequests, 'Help requests stats exist');
    assert.ok(adminDashboard.body.data.fundRaises, 'Fund raises stats exist');
    assert.ok(adminDashboard.body.data.donations, 'Donation stats exist');
    assert.ok(adminDashboard.body.data.programs, 'Program stats exist');
  });

  test('Dashboard metrics are real numbers calculated from database', () => {
    const d = adminDashboard.body.data;
    assert(typeof d.users.total === 'number' && d.users.total > 0, 'Users total is a positive number');
    assert(typeof d.users.admins === 'number' && d.users.admins >= 1, 'Admin count >= 1');
    assert(typeof d.ngos.total === 'number' && d.ngos.total >= 3, 'NGO count >= 3');
    assert(typeof d.donations.totalCount === 'number' && d.donations.totalCount > 0, 'Donation totalCount > 0');
    assert(typeof d.donations.totalAmount === 'number' && d.donations.totalAmount > 0, 'Donation totalAmount > 0');
    assert(typeof d.programs.total === 'number' && d.programs.total > 0, 'Program total > 0');
    assert(Array.isArray(d.recentActivity), 'recentActivity is an array');
    assert(d.pendingQueue && typeof d.pendingQueue === 'object', 'pendingQueue exists');
  });

  // ------------------------------------------------------------------------
  // 4. USER MANAGEMENT (Safe fields only, role filter, search)
  // ------------------------------------------------------------------------
  const usersRes = await request('GET', '/api/admin/users', null, adminToken);
  test('Admin /api/admin/users returns safe fields only (no passwords or hashes)', () => {
    assert.strictEqual(usersRes.status, 200);
    const users = usersRes.body.data.users;
    assert(Array.isArray(users), 'Users array returned');
    for (const u of users) {
      assert.strictEqual(u.password, undefined, 'Password field must never be returned');
      assert.strictEqual(u.passwordHash, undefined, 'passwordHash must never be returned');
    }
  });

  const filterRoleRes = await request('GET', '/api/admin/users?role=VOLUNTEER', null, adminToken);
  test('User filtering by role (?role=VOLUNTEER) works accurately', () => {
    assert.strictEqual(filterRoleRes.status, 200);
    const users = filterRoleRes.body.data.users;
    assert(users.length > 0, 'Found volunteer users');
    for (const u of users) {
      assert.strictEqual(u.role.toLowerCase(), 'volunteer');
    }
  });

  // ------------------------------------------------------------------------
  // 5. NGO MANAGEMENT (Status transitions: PENDING, APPROVED, REJECTED, NEEDS_INFO)
  // ------------------------------------------------------------------------
  // First, submit a test NGO as beneficiary/user to have a fresh pending NGO
  const newNgoPayload = {
    organizationName: 'Pratibha Education Society',
    description: 'Empowering tribal girl children with educational scholarships and mentoring.',
    ngoType: 'Society',
    founder: 'Shalini Pradhan',
    authorizedRepresentative: 'Shalini Pradhan',
    contactEmail: `pratibha.${Date.now()}@example.org`,
    phone: '+91 99887 76655',
    address: 'Plot 10, Civil Lines',
    city: 'Nagpur',
    state: 'Maharashtra',
    pincode: '440001',
    registrationNumber: `MH/${Date.now()}/TEST`,
    registrationCertificate: '/images/cert-sample.pdf',
    causes: ['Education', 'Girl Child'],
    areasOfWork: ['Scholarships', 'Mentorship'],
    programs: ['Shiksha Jyoti'],
    yearsOfOperation: 5
  };

  const submitNgoRes = await request('POST', '/api/ngos', newNgoPayload, beneficiaryToken);
  assert(submitNgoRes.status === 201, `NGO submission failed: ${JSON.stringify(submitNgoRes.body)}`);
  const testNgoId = submitNgoRes.body.ngo.id;

  test('New NGO created with status PENDING', () => {
    assert.strictEqual(submitNgoRes.body.ngo.status, 'PENDING');
  });

  // Admin inspects NGO details
  const inspectNgoRes = await request('GET', `/api/admin/ngos/${testNgoId}`, null, adminToken);
  test('Admin can view detailed NGO registration record', () => {
    assert.strictEqual(inspectNgoRes.status, 200);
    assert.strictEqual(inspectNgoRes.body.data.id, testNgoId);
    assert.strictEqual(inspectNgoRes.body.data.organizationName, newNgoPayload.organizationName);
  });

  // Admin marks NEEDS_INFO
  const needsInfoRes = await request('PATCH', `/api/admin/ngos/${testNgoId}/status`, {
    status: 'NEEDS_INFO',
    note: 'Please provide certified audit statement copy.'
  }, adminToken);
  test('Admin transitions NGO to NEEDS_INFO with review note', () => {
    assert.strictEqual(needsInfoRes.status, 200);
    assert.strictEqual(needsInfoRes.body.data.status, 'NEEDS_INFO');
    assert.strictEqual(needsInfoRes.body.data.adminReview.status, 'NEEDS_INFO');
    assert(needsInfoRes.body.data.adminReview.note.includes('audit statement'), 'Review note recorded');
  });

  // Admin marks REJECTED
  const rejectRes = await request('PATCH', `/api/admin/ngos/${testNgoId}/status`, {
    status: 'REJECTED',
    note: 'Non-compliant documentation submitted.'
  }, adminToken);
  test('Admin transitions NGO to REJECTED', () => {
    assert.strictEqual(rejectRes.status, 200);
    assert.strictEqual(rejectRes.body.data.status, 'REJECTED');
    assert.strictEqual(rejectRes.body.data.isVerified, false);
  });

  // Admin marks APPROVED
  const approveNgoRes = await request('PATCH', `/api/admin/ngos/${testNgoId}/status`, {
    status: 'APPROVED',
    note: 'Exemplary credentials verified. Approved as Impact Bridge Partner.'
  }, adminToken);
  test('Admin transitions NGO to APPROVED (isVerified = true)', () => {
    assert.strictEqual(approveNgoRes.status, 200);
    assert.strictEqual(approveNgoRes.body.data.status, 'APPROVED');
    assert.strictEqual(approveNgoRes.body.data.isVerified, true);
  });

  // Verify approved NGO appears in public directory
  const publicNgosRes = await request('GET', '/api/ngos');
  test('APPROVED NGO is now visible in public verified directory', () => {
    assert.strictEqual(publicNgosRes.status, 200);
    const found = publicNgosRes.body.ngos.find((n) => n.id === testNgoId);
    assert(found !== undefined, 'Approved NGO appears in public list');
    assert.strictEqual(found.status, 'APPROVED');
  });

  // ------------------------------------------------------------------------
  // 6. HELP REQUEST MANAGEMENT
  // ------------------------------------------------------------------------
  const submitHelpRes = await request('POST', '/api/requests/find-help', {
    requesterName: 'Kishore Kumar',
    phone: '+91 98765 43219',
    city: 'Pune',
    category: 'Healthcare Support',
    description: 'Require post-surgery medication assistance for elder parent.',
    urgency: 'High'
  }, beneficiaryToken);
  assert(submitHelpRes.status === 201, 'Submit help request succeeded');
  const helpReqId = submitHelpRes.body.requestId;

  const updateHelpRes = await request('PATCH', `/api/admin/help-requests/${helpReqId}/status`, {
    status: 'APPROVED',
    note: 'Verified with local dispensary in Pune.'
  }, adminToken);
  test('Admin updates help-request status to APPROVED', () => {
    assert.strictEqual(updateHelpRes.status, 200);
    assert.strictEqual(updateHelpRes.body.data.status, 'APPROVED');
  });

  // ------------------------------------------------------------------------
  // 7. FUND RAISE MANAGEMENT
  // ------------------------------------------------------------------------
  const submitFundRes = await request('POST', '/api/requests/fund-raise', {
    title: 'Flood Relief Shelter Staging',
    category: 'Disaster Relief',
    targetAmount: 500000,
    description: 'Pre-positioning essential survival food kits for flood affected families.',
    beneficiaryStory: 'Direct aid to displaced rural families.',
    location: 'Patna, Bihar',
    phone: '+91 94310 12345'
  }, beneficiaryToken);
  assert(submitFundRes.status === 201, `Submit fund raise failed: ${JSON.stringify(submitFundRes.body)}`);
  const fundRaiseId = submitFundRes.body.campaign?.id || submitFundRes.body.campaignId;

  const updateFundRes = await request('PATCH', `/api/admin/fund-raises/${fundRaiseId}/status`, {
    status: 'APPROVED',
    note: 'Approved for active fundraising portal listing.'
  }, adminToken);
  test('Admin updates fund-raise status to APPROVED', () => {
    assert.strictEqual(updateFundRes.status, 200);
    assert.strictEqual(updateFundRes.body.data.status, 'APPROVED');
  });

  // ------------------------------------------------------------------------
  // 8. DONATIONS ENDPOINT
  // ------------------------------------------------------------------------
  const donationsRes = await request('GET', '/api/admin/donations', null, adminToken);
  test('Admin can view real donations with totalCount and totalAmount', () => {
    assert.strictEqual(donationsRes.status, 200);
    assert.ok(donationsRes.body.data.donations.length > 0, 'Donations array populated');
    assert(donationsRes.body.data.totalCount > 0, 'totalCount > 0');
    assert(donationsRes.body.data.totalAmount > 0, 'totalAmount > 0');

    // Check sensitive data masking
    for (const d of donationsRes.body.data.donations) {
      assert.strictEqual(d.cardNumber, undefined, 'No credit card numbers');
      if (d.panNumber) {
        assert(d.panNumber.startsWith('XXXXX'), 'PAN number is masked');
      }
    }
  });

  // ------------------------------------------------------------------------
  // 9. PROGRAM MANAGEMENT CRUD
  // ------------------------------------------------------------------------
  const newProgram = {
    title: 'Asha Jyoti: Vocational Sewing Training',
    category: 'Livelihoods',
    location: 'Ranchi, Jharkhand',
    city: 'Ranchi',
    budget: 850000,
    lead: 'Kavita Soren',
    shortDesc: 'Vocational stitching, embroidery and tailoring training for tribal women.',
    description: 'Enabling 120 rural tribal women to achieve financial independence through high-demand garment production.'
  };

  const createProgRes = await request('POST', '/api/admin/programs', newProgram, adminToken);
  test('Admin creates new program (POST /api/admin/programs)', () => {
    assert.strictEqual(createProgRes.status, 201);
    assert.strictEqual(createProgRes.body.data.title, newProgram.title);
  });
  const createdProgId = createProgRes.body.data.id;

  const updateProgRes = await request('PUT', `/api/admin/programs/${createdProgId}`, {
    budget: 950000,
    progress: 25
  }, adminToken);
  test('Admin updates program (PUT /api/admin/programs/:id)', () => {
    assert.strictEqual(updateProgRes.status, 200);
    assert.strictEqual(updateProgRes.body.data.budget, 950000);
    assert.strictEqual(updateProgRes.body.data.progress, 25);
  });

  const deleteProgRes = await request('DELETE', `/api/admin/programs/${createdProgId}`, null, adminToken);
  test('Admin deletes program (DELETE /api/admin/programs/:id)', () => {
    assert.strictEqual(deleteProgRes.status, 200);
    assert.strictEqual(deleteProgRes.body.data.id, createdProgId);
  });

  // ------------------------------------------------------------------------
  // 10. MESSAGES / CONTACT REQUESTS
  // ------------------------------------------------------------------------
  const messagesRes = await request('GET', '/api/admin/messages', null, adminToken);
  test('Admin retrieves contact messages with status stats', () => {
    assert.strictEqual(messagesRes.status, 200);
    assert(messagesRes.body.data.messages.length > 0, 'Messages returned');
    assert.ok(messagesRes.body.data.stats, 'Message stats returned');
  });

  const firstMsgId = messagesRes.body.data.messages[0].id;
  const updateMsgRes = await request('PATCH', `/api/admin/messages/${firstMsgId}/status`, {
    status: 'RESOLVED',
    note: 'Contacted applicant and coordinated interview.'
  }, adminToken);
  test('Admin updates message status to RESOLVED with note', () => {
    assert.strictEqual(updateMsgRes.status, 200);
    assert.strictEqual(updateMsgRes.body.data.status, 'RESOLVED');
  });

  // ------------------------------------------------------------------------
  // 11. VERIFIED HUB MANAGEMENT CRUD
  // ------------------------------------------------------------------------
  const newHub = {
    name: 'Kolkata Sunderbans Marine Resilience Base',
    category: 'NGO Center',
    city: 'Kolkata',
    state: 'West Bengal',
    address: 'Canning Coastal Highway, South 24 Parganas 743329',
    latitude: 22.3120,
    longitude: 88.6650,
    programName: 'Mangrove & Cyclone Rapid Response',
    phone: '+91 33 2450 1199',
    lead: 'Dr. Subhashish Roy'
  };

  const createHubRes = await request('POST', '/api/admin/verified-hubs', newHub, adminToken);
  test('Admin creates new Verified Hub (POST /api/admin/verified-hubs)', () => {
    assert.strictEqual(createHubRes.status, 201);
    assert.strictEqual(createHubRes.body.data.name, newHub.name);
    assert.strictEqual(createHubRes.body.data.isVerified, true);
  });
  const createdHubId = createHubRes.body.data.id;

  const updateHubRes = await request('PUT', `/api/admin/verified-hubs/${createdHubId}`, {
    beneficiaries: 3200,
    volunteers: 45
  }, adminToken);
  test('Admin updates Verified Hub (PUT /api/admin/verified-hubs/:id)', () => {
    assert.strictEqual(updateHubRes.status, 200);
    assert.strictEqual(updateHubRes.body.data.beneficiaries, 3200);
    assert.strictEqual(updateHubRes.body.data.volunteers, 45);
  });

  const deleteHubRes = await request('DELETE', `/api/admin/verified-hubs/${createdHubId}`, null, adminToken);
  test('Admin deletes Verified Hub (DELETE /api/admin/verified-hubs/:id)', () => {
    assert.strictEqual(deleteHubRes.status, 200);
    assert.strictEqual(deleteHubRes.body.data.id, createdHubId);
  });

  // ------------------------------------------------------------------------
  // 12. AUDIT LOG VERIFICATION
  // ------------------------------------------------------------------------
  const auditLogsRes = await request('GET', '/api/admin/audit-logs', null, adminToken);
  test('Admin audit logs record previous administrative actions', () => {
    assert.strictEqual(auditLogsRes.status, 200);
    const logs = auditLogsRes.body.data.logs;
    assert(logs.length > 0, 'Audit logs have recorded actions');
    const hasNgoAction = logs.some((l) => l.targetType === 'NGO');
    assert(hasNgoAction, 'Audit log recorded NGO status changes');
  });

  // ------------------------------------------------------------------------
  // 13. IDOR / ROLE MODIFICATION SECURITY CHECK
  // ------------------------------------------------------------------------
  const normalUserTryDemoteAdmin = await request('PATCH', '/api/admin/users/USR-ADMIN-01/role', {
    role: 'donor'
  }, donorToken);
  test('Non-admin user cannot access role update endpoint (403)', () => {
    assert.strictEqual(normalUserTryDemoteAdmin.status, 403);
  });

  const adminTryDemotePrimaryAdmin = await request('PATCH', '/api/admin/users/USR-ADMIN-01/role', {
    role: 'donor'
  }, adminToken);
  test('Admin cannot demote Primary Project Administrator (403)', () => {
    assert.strictEqual(adminTryDemotePrimaryAdmin.status, 403);
  });

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passed}/${total} TEST SUITE ASSERTIONS PASSED SUCCESSFULLY!`);
  console.log('====================================================\n');
}

runAllTests().catch((err) => {
  console.error('\n❌ TEST RUN ABORTED WITH ERROR:', err);
  process.exit(1);
});
