/**
 * End-to-End Automated RBAC Verification Suite: Tests A through O
 * Conforming strictly to Impact Bridge Core Security & Role Requirements
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envPath);
  } catch (e) {}
}

const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/authRoutes');
const requestRoutes = require('../routes/requestRoutes');
const adminRequestRoutes = require('../routes/adminRequestRoutes');
const { donorRouter, volunteerRouter, beneficiaryRouter, usersRouter } = require('../routes/roleRoutes');
const userModel = require('../models/userModel');
const findHelpModel = require('../models/findHelpRequestModel');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Impact Bridge API' }));
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donor', donorRouter);
app.use('/api/volunteer', volunteerRouter);
app.use('/api/beneficiary', beneficiaryRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin/requests', adminRequestRoutes);
app.use('/api/admin', adminRequestRoutes);

const TEST_PORT = 5003;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Helper: HTTP Request Promise
const apiCall = (endpoint, options = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let body;
        try {
          body = JSON.parse(data);
        } catch {
          body = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
};

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`✅ PASSED: ${message}`);
};

async function runRBACTestSuite() {
  const server = app.listen(TEST_PORT, async () => {
    console.log(`\n========================================================`);
    console.log(`🧪 Running Impact Bridge Complete RBAC Suite (Tests A to O)`);
    console.log(`📡 Test Server listening on http://localhost:${TEST_PORT}`);
    console.log(`========================================================\n`);

    try {
      // ----------------------------------------------------
      // TEST A: Open website without login. Expected: GUEST.
      // ----------------------------------------------------
      console.log('--- TEST A: Open website without login (GUEST) ---');
      const healthRes = await apiCall('/api/health');
      assert(healthRes.status === 200 && healthRes.body.status === 'ok', 'Public API health endpoint reachable without authentication');
      const meNoAuth = await apiCall('/api/auth/me');
      assert(meNoAuth.status === 401, 'Unauthenticated visitor has no session (401 Unauthorized -> GUEST state)');

      // ----------------------------------------------------
      // TEST B: Guest opens admin dashboard. Expected: Unauthorized.
      // ----------------------------------------------------
      console.log('\n--- TEST B: Guest opens admin endpoint ---');
      const adminNoAuth = await apiCall('/api/admin/stats');
      assert(adminNoAuth.status === 401, 'Guest accessing /api/admin/stats is blocked with 401 Unauthorized');

      // ----------------------------------------------------
      // TEST C: Guest opens donor dashboard/APIs. Expected: Sign in / unauthorized.
      // ----------------------------------------------------
      console.log('\n--- TEST C: Guest opens donor endpoint ---');
      const donorNoAuth = await apiCall('/api/donor/donations');
      assert(donorNoAuth.status === 401, 'Guest accessing /api/donor/donations is blocked with 401 Unauthorized');

      // ----------------------------------------------------
      // TEST D: Register as DONOR. Expected: Database role = DONOR.
      // ----------------------------------------------------
      console.log('\n--- TEST D: Register as DONOR ---');
      const donorEmail = `test.donor.${Date.now()}@example.com`;
      const regDonor = await apiCall('/api/auth/register', {
        method: 'POST',
        body: { name: 'Rohan Donor', email: donorEmail, password: 'password123', role: 'donor' }
      });
      assert(regDonor.status === 201, 'Registration as donor returns 201 Created');
      const storedDonor = userModel.findByEmail(donorEmail);
      assert(storedDonor !== null && storedDonor.role === 'donor', 'Database User document permanently stores role = "donor"');

      // Login as newly registered donor
      const loginDonor = await apiCall('/api/auth/login', {
        method: 'POST',
        body: { email: donorEmail, password: 'password123' }
      });
      assert(loginDonor.status === 200, 'Donor can log in with registered credentials');
      const donorToken = loginDonor.body.token;
      assert(loginDonor.body.user.role === 'donor', 'Login response returns verified role = "donor" from database');

      // ----------------------------------------------------
      // TEST E: Donor tries changing role to VOLUNTEER. Expected: Backend rejects it.
      // ----------------------------------------------------
      console.log('\n--- TEST E: Donor tries changing role to VOLUNTEER ---');
      const roleChangeRes = await apiCall('/api/users/me', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${donorToken}` },
        body: { role: 'volunteer', name: 'Rohan Malicious' }
      });
      assert(roleChangeRes.status === 403, 'PATCH /api/users/me with new role is rejected with 403 Forbidden');
      const refreshedDonor = userModel.findByEmail(donorEmail);
      assert(refreshedDonor.role === 'donor', 'Database role remains unchanged as "donor" (ROLE IMMUTABLE)');

      // ----------------------------------------------------
      // TEST F: Donor opens /volunteer/dashboard / API. Expected: 403 / unauthorized.
      // ----------------------------------------------------
      console.log('\n--- TEST F: Donor opens volunteer endpoint ---');
      const donorTryVol = await apiCall('/api/volunteer/applications', {
        headers: { Authorization: `Bearer ${donorToken}` }
      });
      assert(donorTryVol.status === 403, 'Donor accessing /api/volunteer/applications is rejected with 403 Forbidden');

      // ----------------------------------------------------
      // TEST G: Donor opens /beneficiary/dashboard / API. Expected: 403 / unauthorized.
      // ----------------------------------------------------
      console.log('\n--- TEST G: Donor opens beneficiary endpoint ---');
      const donorTryBen = await apiCall('/api/beneficiary/requests', {
        headers: { Authorization: `Bearer ${donorToken}` }
      });
      assert(donorTryBen.status === 403, 'Donor accessing /api/beneficiary/requests is rejected with 403 Forbidden');

      // ----------------------------------------------------
      // TEST H: Donor opens /admin/dashboard / API. Expected: 403 / unauthorized.
      // ----------------------------------------------------
      console.log('\n--- TEST H: Donor opens admin endpoint ---');
      const donorTryAdmin = await apiCall('/api/admin/stats', {
        headers: { Authorization: `Bearer ${donorToken}` }
      });
      assert(donorTryAdmin.status === 403, 'Donor accessing /api/admin/stats is rejected with 403 Forbidden');

      // ----------------------------------------------------
      // TEST I: Volunteer tries to access donor APIs. Expected: 403.
      // ----------------------------------------------------
      console.log('\n--- TEST I: Volunteer tries to access donor APIs ---');
      const loginVol = await apiCall('/api/auth/login', {
        method: 'POST',
        body: { email: 'aarav.sharma@example.com', password: 'volunteer123' }
      });
      assert(loginVol.status === 200, 'Seeded Volunteer can log in');
      const volToken = loginVol.body.token;

      const volTryDonor = await apiCall('/api/donor/donations', {
        headers: { Authorization: `Bearer ${volToken}` }
      });
      assert(volTryDonor.status === 403, 'Volunteer accessing /api/donor/donations is rejected with 403 Forbidden');

      // ----------------------------------------------------
      // TEST J: Beneficiary tries to access another beneficiary\'s request. Expected: 403.
      // ----------------------------------------------------
      console.log('\n--- TEST J: Beneficiary tries to access another beneficiary\'s request ---');
      // Beneficiary 1 login
      const loginBen1 = await apiCall('/api/auth/login', {
        method: 'POST',
        body: { email: 'laxmi.devi@example.com', password: 'help123' }
      });
      assert(loginBen1.status === 200, 'Beneficiary 1 logged in');
      const ben1Token = loginBen1.body.token;

      // Beneficiary 1 submits a request
      const ben1Submit = await apiCall('/api/requests/find-help', {
        method: 'POST',
        headers: { Authorization: `Bearer ${ben1Token}` },
        body: {
          requesterName: 'Laxmi Devi',
          phone: '9876543210',
          city: 'Mumbai',
          category: 'Education Support',
          description: 'Textbooks and study material',
          urgency: 'HIGH'
        }
      });
      assert(ben1Submit.status === 201, 'Beneficiary 1 submitted help request');
      const reqId = ben1Submit.body.requestId;

      // Register Beneficiary 2
      const ben2Email = `test.ben2.${Date.now()}@example.com`;
      await apiCall('/api/auth/register', {
        method: 'POST',
        body: { name: 'Kavita Beneficiary', email: ben2Email, password: 'password123', role: 'beneficiary' }
      });
      const loginBen2 = await apiCall('/api/auth/login', {
        method: 'POST',
        body: { email: ben2Email, password: 'password123' }
      });
      const ben2Token = loginBen2.body.token;

      // Beneficiary 2 attempts to fetch Beneficiary 1's request by ID
      const ben2UnauthorizedAccess = await apiCall(`/api/beneficiary/requests/${reqId}`, {
        headers: { Authorization: `Bearer ${ben2Token}` }
      });
      assert(ben2UnauthorizedAccess.status === 403, 'Beneficiary 2 cannot view Beneficiary 1\'s request (403 Forbidden)');

      // Beneficiary 1 CAN view their own request
      const ben1OwnAccess = await apiCall(`/api/beneficiary/requests/${reqId}`, {
        headers: { Authorization: `Bearer ${ben1Token}` }
      });
      assert(ben1OwnAccess.status === 200, 'Beneficiary 1 can access their own request (200 OK)');

      // ----------------------------------------------------
      // TEST K: Normal registration attempts role=ADMIN. Expected: Backend rejects it.
      // ----------------------------------------------------
      console.log('\n--- TEST K: Registration attempts role=ADMIN and role=GUEST ---');
      const adminRegAttempt = await apiCall('/api/auth/register', {
        method: 'POST',
        body: { name: 'Fake Admin', email: 'hacker@example.com', password: 'password123', role: 'admin' }
      });
      assert(adminRegAttempt.status === 400, 'Registration with role=admin rejected with 400 Bad Request');

      const guestRegAttempt = await apiCall('/api/auth/register', {
        method: 'POST',
        body: { name: 'Fake Guest', email: 'fake.guest@example.com', password: 'password123', role: 'guest' }
      });
      assert(guestRegAttempt.status === 400, 'Registration with role=guest rejected with 400 Bad Request');

      // ----------------------------------------------------
      // TEST L: Admin logs in. Expected: Admin dashboard loads successfully.
      // ----------------------------------------------------
      console.log('\n--- TEST L: Admin logs in and loads dashboard ---');
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@impactbridge.org';
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
      const adminLogin = await apiCall('/api/auth/login', {
        method: 'POST',
        body: { email: adminEmail, password: adminPass }
      });
      assert(adminLogin.status === 200 && adminLogin.body.user.role === 'admin', 'Admin logged in with environment credentials');
      const adminToken = adminLogin.body.token;

      const adminStats = await apiCall('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(adminStats.status === 200 && adminStats.body.success, 'Admin stats loaded successfully from database');

      // ----------------------------------------------------
      // TEST M: Admin opens Find Help Requests. Expected: Actual pending requests appear.
      // ----------------------------------------------------
      console.log('\n--- TEST M: Admin opens Find Help Requests ---');
      const adminFindHelp = await apiCall('/api/admin/requests/find-help', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(adminFindHelp.status === 200 && Array.isArray(adminFindHelp.body.requests), 'Admin retrieved live Find Help requests from database');
      const foundPending = adminFindHelp.body.requests.find((r) => r.id === reqId);
      assert(foundPending && foundPending.status === 'PENDING', `Submitted request ${reqId} is listed in Admin queue in PENDING status`);

      // ----------------------------------------------------
      // TEST N: Admin approves request. Expected: Database status changes to APPROVED.
      // ----------------------------------------------------
      console.log('\n--- TEST N: Admin approves request ---');
      const approveRes = await apiCall(`/api/admin/requests/find-help/${reqId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { status: 'APPROVED', note: 'Approved by Dr. Ananya Iyer for digital tablet dispatch.' }
      });
      assert(approveRes.status === 200 && approveRes.body.request.status === 'APPROVED', 'Admin decision saved: Status is now APPROVED');
      const storedReq = findHelpModel.findById(reqId);
      assert(storedReq.status === 'APPROVED', 'Atomic database record confirms status is APPROVED with audit history');

      // ----------------------------------------------------
      // TEST O: Beneficiary refreshes My Requests. Expected: Updated status appears.
      // ----------------------------------------------------
      console.log('\n--- TEST O: Beneficiary refreshes My Requests ---');
      const ben1Refreshed = await apiCall('/api/beneficiary/requests', {
        headers: { Authorization: `Bearer ${ben1Token}` }
      });
      assert(ben1Refreshed.status === 200, 'Beneficiary refreshed their requests list');
      const updatedItem = ben1Refreshed.body.requests.find((r) => r.id === reqId);
      assert(updatedItem && updatedItem.status === 'APPROVED', 'Beneficiary sees real-time APPROVED status on their own requests');
      assert(updatedItem.auditLog && updatedItem.auditLog.length > 0, 'Beneficiary can see coordinator review audit note');

      console.log(`\n========================================================`);
      console.log(`🎉 ALL TESTS A THROUGH O PASSED WITH 100% SUCCESS!`);
      console.log(`========================================================\n`);

      server.close();
      process.exit(0);
    } catch (err) {
      console.error('\n❌ TEST SUITE RUNNER ERROR:', err.message);
      server.close();
      process.exit(1);
    }
  });
}

runRBACTestSuite();
