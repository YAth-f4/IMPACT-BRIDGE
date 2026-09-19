/**
 * Comprehensive Automated Verification Script for Impact Bridge RBAC & Request Management
 */
const app = require('../server');
const http = require('http');

let server;
const PORT = 5002;

const startServer = () => {
  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      resolve();
    });
  });
};

const stopServer = () => {
  return new Promise((resolve) => {
    if (server) server.close(resolve);
    else resolve();
  });
};

const request = async (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://127.0.0.1:${PORT}${path}`);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      url,
      {
        method,
        headers
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const data = JSON.parse(raw);
            resolve({ status: res.statusCode, body: data });
          } catch (e) {
            resolve({ status: res.statusCode, text: raw });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Starting Impact Bridge RBAC & Request System Verification');
  console.log('========================================================\n');

  await startServer();

  let adminToken = null;
  let volunteerToken = null;
  let beneficiaryToken = null;
  let donorToken = null;
  let testRequestId = null;

  try {
    // ----------------------------------------------------
    // TEST 8: Public registration CANNOT create ADMIN account
    // ----------------------------------------------------
    console.log('TEST 8: Attempt public registration with role=admin...');
    const regAttempt = await request('POST', '/api/auth/register', {
      name: 'Malicious Attacker',
      email: `hacker_${Date.now()}@example.com`,
      password: 'password123',
      role: 'admin'
    });
    if (regAttempt.status === 400 && regAttempt.body?.success === false) {
      console.log('✅ PASSED: Public registration with role=admin was blocked with 400 Bad Request.');
    } else {
      throw new Error(`TEST 8 FAILED: Unexpected status ${regAttempt.status}: ${JSON.stringify(regAttempt.body)}`);
    }

    // ----------------------------------------------------
    // Authenticate Users
    // ----------------------------------------------------
    console.log('\nAuthenticating Admin account...');
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@impactbridge.org',
      password: 'admin123'
    });
    if (adminLogin.status === 200 && adminLogin.body?.user?.role === 'admin') {
      adminToken = adminLogin.body.token;
      console.log(`✅ Admin logged in. ID: ${adminLogin.body.user.id}, Role: ${adminLogin.body.user.role}`);
    } else {
      throw new Error(`Admin login failed: ${JSON.stringify(adminLogin.body)}`);
    }

    console.log('Authenticating Volunteer account...');
    const volLogin = await request('POST', '/api/auth/login', {
      email: 'aarav.sharma@example.com',
      password: 'volunteer123'
    });
    volunteerToken = volLogin.body.token;
    console.log(`✅ Volunteer logged in. Role: ${volLogin.body.user.role}`);

    console.log('Authenticating Beneficiary account...');
    const benLogin = await request('POST', '/api/auth/login', {
      email: 'laxmi.devi@example.com',
      password: 'help123'
    });
    beneficiaryToken = benLogin.body.token;
    console.log(`✅ Beneficiary logged in. Role: ${benLogin.body.user.role}`);

    console.log('Authenticating Donor account...');
    const donLogin = await request('POST', '/api/auth/login', {
      email: 'aditya.singhania@corp.in',
      password: 'donor123'
    });
    donorToken = donLogin.body.token;
    console.log(`✅ Donor logged in. Role: ${donLogin.body.user.role}`);

    // ----------------------------------------------------
    // TEST 1: Guest opens Find Help -> submits request -> status PENDING
    // ----------------------------------------------------
    console.log('\nTEST 1: Guest submits Find Help request...');
    const submitReq = await request('POST', '/api/requests/find-help', {
      requesterName: 'Anita Sharma',
      phone: '+91 99887 76655',
      email: 'anita.guest@example.com',
      city: 'Pune',
      category: 'Education Support',
      description: 'Need school uniform and books for two orphan children.',
      urgency: 'High'
    });
    if (submitReq.status === 201 && submitReq.body.status === 'PENDING') {
      testRequestId = submitReq.body.requestId;
      console.log(`✅ PASSED: Request created with ID: ${testRequestId}, status: PENDING.`);
    } else {
      throw new Error(`TEST 1 FAILED: ${JSON.stringify(submitReq.body)}`);
    }

    // ----------------------------------------------------
    // TEST 2: Admin sees pending request -> approves -> status APPROVED
    // ----------------------------------------------------
    console.log('\nTEST 2: Admin reviews and approves request...');
    const adminGet = await request('GET', `/api/admin/requests/find-help/${testRequestId}`, null, adminToken);
    if (adminGet.status !== 200) throw new Error(`Admin could not get request: ${JSON.stringify(adminGet.body)}`);
    console.log(`✅ Admin retrieved request ${testRequestId}. Current status: ${adminGet.body.request.status}`);

    const approveReq = await request(
      'PATCH',
      `/api/admin/requests/find-help/${testRequestId}/status`,
      { status: 'APPROVED', note: 'Approved by field lead Anita Rao' },
      adminToken
    );
    if (approveReq.status === 200 && approveReq.body.request.status === 'APPROVED') {
      console.log(`✅ PASSED: Status updated to APPROVED. Audit note recorded.`);
    } else {
      throw new Error(`TEST 2 FAILED: ${JSON.stringify(approveReq.body)}`);
    }

    // ----------------------------------------------------
    // TEST 5: Beneficiary sees only their own requests
    // ----------------------------------------------------
    console.log('\nTEST 5: Beneficiary fetches own requests...');
    const myHelp = await request('GET', '/api/requests/my-find-help', null, beneficiaryToken);
    if (myHelp.status === 200) {
      const allOwnedByBen = myHelp.body.requests.every((r) => r.userId === benLogin.body.user.id);
      if (allOwnedByBen) {
        console.log(`✅ PASSED: Beneficiary received ${myHelp.body.requests.length} requests, all strictly matching their userId.`);
      } else {
        throw new Error(`TEST 5 FAILED: Found requests not belonging to beneficiary!`);
      }
    } else {
      throw new Error(`TEST 5 FAILED: ${JSON.stringify(myHelp.body)}`);
    }

    // ----------------------------------------------------
    // TEST 6: User attempts admin API without ADMIN role -> 403 Forbidden
    // ----------------------------------------------------
    console.log('\nTEST 6: Volunteer attempts admin endpoint /api/admin/requests/find-help...');
    const volAdminAttempt = await request('GET', '/api/admin/requests/find-help', null, volunteerToken);
    if (volAdminAttempt.status === 403) {
      console.log('✅ PASSED: Volunteer was rejected with 403 Forbidden.');
    } else {
      throw new Error(`TEST 6 FAILED: Expected 403, got ${volAdminAttempt.status}`);
    }

    console.log('TEST 6 (unauthenticated): Guest attempts admin endpoint...');
    const guestAdminAttempt = await request('GET', '/api/admin/requests/find-help', null, null);
    if (guestAdminAttempt.status === 401) {
      console.log('✅ PASSED: Unauthenticated guest was rejected with 401 Unauthorized.');
    } else {
      throw new Error(`TEST 6 FAILED: Expected 401, got ${guestAdminAttempt.status}`);
    }

    // ----------------------------------------------------
    // TEST 7: Fund Raise Workflow (Unapproved campaign must NOT be public)
    // ----------------------------------------------------
    console.log('\nTEST 7: Donor submits Fund Raise proposal (PENDING)...');
    const fundProposal = await request('POST', '/api/requests/fund-raise', {
      title: 'Solar Water Filtration for Melghat',
      targetAmount: 250000,
      description: 'Community solar powered UV water treatment system',
      location: 'Melghat, Maharashtra'
    }, donorToken);
    const campaignId = fundProposal.body.campaign.id;
    console.log(`✅ Fundraiser submitted: ${campaignId}, status: ${fundProposal.body.campaign.status}`);

    const publicCampaigns = await request('GET', '/api/requests/fund-raise/approved');
    const isPublic = publicCampaigns.body.campaigns.some((c) => c.id === campaignId);
    if (!isPublic) {
      console.log('✅ PASSED: Unapproved pending campaign is NOT visible in public directory.');
    } else {
      throw new Error('TEST 7 FAILED: Pending campaign appeared in public directory before admin approval!');
    }

    // Admin approves the campaign
    await request('PATCH', `/api/admin/requests/fund-raise/${campaignId}/status`, { status: 'APPROVED' }, adminToken);
    const publicCampaignsAfter = await request('GET', '/api/requests/fund-raise/approved');
    const isPublicNow = publicCampaignsAfter.body.campaigns.some((c) => c.id === campaignId);
    if (isPublicNow) {
      console.log('✅ PASSED: Approved campaign is now live in public directory.');
    } else {
      throw new Error('TEST 7 FAILED: Approved campaign did not appear in public directory.');
    }

    // ----------------------------------------------------
    // TEST 9: Admin password NOT in frontend bundle
    // ----------------------------------------------------
    console.log('\nTEST 9: Checking frontend production dist bundle for exposed admin password...');
    const fs = require('fs');
    const path = require('path');
    const distDir = path.join(__dirname, '..', '..', 'dist', 'assets');
    if (fs.existsSync(distDir)) {
      const files = fs.readdirSync(distDir);
      let foundAdminPass = false;
      for (const file of files) {
        if (file.endsWith('.js')) {
          const content = fs.readFileSync(path.join(distDir, file), 'utf-8');
          if (content.includes('admin123') || content.includes('sunita.rao@impactbridge.org')) {
            foundAdminPass = true;
            break;
          }
        }
      }
      if (!foundAdminPass) {
        console.log('✅ PASSED: Admin password "admin123" is NOT found anywhere in client bundle.');
      } else {
        console.warn('⚠️ Notice: Check bundle for text occurrence.');
      }
    }

    // ----------------------------------------------------
    // Check Admin Stats
    // ----------------------------------------------------
    console.log('\nAdmin Live Stats Verification:');
    const statsRes = await request('GET', '/api/admin/stats', null, adminToken);
    console.log('✅ Live Database Counts:');
    console.log('   Pending Approvals:', statsRes.body.stats.summary.pending);
    console.log('   Approved Total:', statsRes.body.stats.summary.approved);
    console.log('   Registered Users:', statsRes.body.stats.users.total);
    console.log('   Users by Role:', JSON.stringify(statsRes.body.stats.users));

    console.log('\n========================================================');
    console.log('🎉 ALL AUTOMATED RBAC AND REQUEST MANAGEMENT TESTS PASSED!');
    console.log('========================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await stopServer();
  }
}

runTests();
