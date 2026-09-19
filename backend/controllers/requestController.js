const findHelpModel = require('../models/findHelpRequestModel');
const fundRaiseModel = require('../models/fundRaiseRequestModel');
const volunteerAppModel = require('../models/volunteerApplicationModel');
const userModel = require('../models/userModel');

/**
 * =========================================================
 * 1. FIND HELP (PUBLIC & USER CONTROLLERS)
 * =========================================================
 */

// POST /api/requests/find-help (Public or Authenticated)
const submitFindHelp = async (req, res) => {
  try {
    const { requesterName, phone, email, city, category, description, urgency } = req.body;

    if (!requesterName || !String(requesterName).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid contact phone number.' });
    }
    if (!city || !String(city).trim()) {
      return res.status(400).json({ success: false, message: 'Please specify your city or region.' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ success: false, message: 'Please describe the assistance you require.' });
    }

    // Bind authentic user ID if request is authenticated
    const userId = req.user ? req.user.id : null;

    const newRequest = findHelpModel.create({
      userId,
      requesterName,
      phone,
      email,
      city,
      category,
      description,
      urgency
    });

    return res.status(201).json({
      success: true,
      message: 'Your help request has been submitted and is awaiting administrator review.',
      requestId: newRequest.id,
      status: newRequest.status,
      submittedAt: newRequest.createdAt
    });
  } catch (err) {
    console.error('[requestController.submitFindHelp] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Unable to submit your request right now. Please try again.' });
  }
};

// GET /api/requests/my-find-help (Authenticated Beneficiary / User)
const getMyFindHelpRequests = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // Security: Only return requests belonging strictly to the authentic logged-in user
    const userRequests = findHelpModel.findByUserId(req.user.id);

    return res.status(200).json({
      success: true,
      requests: userRequests,
      count: userRequests.length
    });
  } catch (err) {
    console.error('[requestController.getMyFindHelpRequests] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve your requests.' });
  }
};

// GET /api/requests/find-help/track/:id?phone=1234 (Public Status Tracker with privacy protection)
const trackFindHelpRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone } = req.query;

    const request = findHelpModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request reference ID not found.' });
    }

    // Privacy Protection: Require matching last 4 digits of phone number if querying publicly
    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, '');
      const storedPhone = String(request.phone).replace(/\D/g, '');
      if (cleanPhone && !storedPhone.endsWith(cleanPhone) && storedPhone !== cleanPhone) {
        return res.status(403).json({ success: false, message: 'Contact verification did not match for this Request ID.' });
      }
    }

    // Sanitize output (do not expose private phone/email publicly)
    const sanitized = {
      id: request.id,
      category: request.category,
      city: request.city,
      status: request.status,
      adminNotes: request.adminNotes,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt
    };

    return res.status(200).json({ success: true, request: sanitized });
  } catch (err) {
    console.error('[requestController.trackFindHelpRequest] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Status lookup failed.' });
  }
};

/**
 * =========================================================
 * 2. FUND RAISE (PUBLIC & USER CONTROLLERS)
 * =========================================================
 */

// POST /api/requests/fund-raise (Authenticated Donor/User)
const submitFundRaise = async (req, res) => {
  try {
    const { title, category, targetAmount, description, beneficiaryStory, location, phone } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a campaign title.' });
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      return res.status(400).json({ success: false, message: 'Please specify a valid funding target amount in INR.' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide details about the campaign purpose.' });
    }

    const newCampaign = fundRaiseModel.create({
      userId: req.user ? req.user.id : null,
      organizerName: req.user?.name || req.body.organizerName || 'Anonymous Organizer',
      email: req.user?.email || req.body.email || '',
      phone: phone || req.body.phone || '',
      title,
      category,
      targetAmount,
      description,
      beneficiaryStory,
      location
    });

    return res.status(201).json({
      success: true,
      message: 'Your fundraising campaign has been submitted and is pending administrator review. It will be published once approved.',
      campaign: newCampaign
    });
  } catch (err) {
    console.error('[requestController.submitFundRaise] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit campaign.' });
  }
};

// GET /api/requests/my-fund-raise (Authenticated Donor/User)
const getMyFundRaiseRequests = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const campaigns = fundRaiseModel.findByUserId(req.user.id);
    return res.status(200).json({ success: true, campaigns });
  } catch (err) {
    console.error('[requestController.getMyFundRaiseRequests] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve campaigns.' });
  }
};

// GET /api/fund-raise/approved (Public - strictly only APPROVED campaigns)
const getApprovedFundraisers = async (req, res) => {
  try {
    const approved = fundRaiseModel.findApproved();
    return res.status(200).json({ success: true, campaigns: approved });
  } catch (err) {
    console.error('[requestController.getApprovedFundraisers] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch public campaigns.' });
  }
};

/**
 * =========================================================
 * 3. VOLUNTEER APPLICATIONS (PUBLIC & USER CONTROLLERS)
 * =========================================================
 */

// POST /api/requests/volunteer (Public or Authenticated)
const submitVolunteerApplication = async (req, res) => {
  try {
    const { name, email, phone, city, skills, interests, availability, emergencyContact, programId } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }
    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your contact phone.' });
    }
    if (!city || !String(city).trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your city.' });
    }

    const app = volunteerAppModel.create({
      userId: req.user ? req.user.id : null,
      name,
      email,
      phone,
      city,
      skills,
      interests,
      availability,
      emergencyContact,
      programId
    });

    return res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully! It is currently under review by the volunteer coordinator.',
      application: app
    });
  } catch (err) {
    console.error('[requestController.submitVolunteerApplication] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
};

// GET /api/requests/my-volunteer (Authenticated Volunteer)
const getMyVolunteerApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    let apps = volunteerAppModel.findByUserId(req.user.id);
    if (apps.length === 0 && req.user.email) {
      const byEmail = volunteerAppModel.findByEmail(req.user.email);
      if (byEmail) apps = [byEmail];
    }

    return res.status(200).json({ success: true, applications: apps });
  } catch (err) {
    console.error('[requestController.getMyVolunteerApplications] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch your volunteer record.' });
  }
};

// POST /api/requests/my-volunteer/log-hours (Authenticated Volunteer)
const logVolunteerHours = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { hours, programTitle } = req.body;
    if (!hours || Number(hours) <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid volunteer hours.' });
    }

    const apps = volunteerAppModel.findByUserId(req.user.id);
    const targetApp = apps[0] || volunteerAppModel.findByEmail(req.user.email);

    if (!targetApp) {
      return res.status(404).json({ success: false, message: 'Active volunteer profile not found.' });
    }

    const updated = volunteerAppModel.logHours(targetApp.id, hours, programTitle);

    return res.status(200).json({
      success: true,
      message: `Successfully logged ${hours} volunteer hours!`,
      application: updated
    });
  } catch (err) {
    console.error('[requestController.logVolunteerHours] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to log hours.' });
  }
};

/**
 * =========================================================
 * 4. ADMIN REQUEST CONTROLLERS (ADMIN-ONLY)
 * =========================================================
 */

// GET /api/admin/requests/find-help
const getAllFindHelpRequests = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const data = findHelpModel.findAll({
      status,
      category,
      search,
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    console.error('[requestController.getAllFindHelpRequests] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load requests.' });
  }
};

// GET /api/admin/requests/find-help/:id
const getFindHelpRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = findHelpModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
    return res.status(200).json({ success: true, request });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving request.' });
  }
};

// PATCH /api/admin/requests/find-help/:id/status
const updateFindHelpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required.' });
    }

    const updated = findHelpModel.updateStatus(id, status, req.user, note);
    return res.status(200).json({
      success: true,
      message: `Find Help request ${id} updated to ${status}.`,
      request: updated
    });
  } catch (err) {
    console.error('[requestController.updateFindHelpStatus] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/admin/requests/fund-raise
const getAllFundRaiseRequests = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const data = fundRaiseModel.findAll({
      status,
      category,
      search,
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load campaigns.' });
  }
};

// PATCH /api/admin/requests/fund-raise/:id/status
const updateFundRaiseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required.' });
    }

    const updated = fundRaiseModel.updateStatus(id, status, req.user, note);
    return res.status(200).json({
      success: true,
      message: `Fund Raise campaign ${id} updated to ${status}.`,
      campaign: updated
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/admin/requests/volunteers
const getAllVolunteerApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const data = volunteerAppModel.findAll({
      status,
      search,
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load volunteer applications.' });
  }
};

// PATCH /api/admin/requests/volunteers/:id/status
const updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required.' });
    }

    const updated = volunteerAppModel.updateStatus(id, status, req.user, note);
    return res.status(200).json({
      success: true,
      message: `Volunteer application ${id} updated to ${status}.`,
      application: updated
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/admin/stats (Real database counts)
const getAdminStats = async (req, res) => {
  try {
    const findHelpStats = findHelpModel.getStats();
    const fundRaiseStats = fundRaiseModel.getStats();
    const volunteerStats = volunteerAppModel.getStats();
    const allUsers = userModel.getAllSafeUsers();

    const userRoleCounts = {
      total: allUsers.length,
      admin: allUsers.filter((u) => u.role === 'admin').length,
      volunteer: allUsers.filter((u) => u.role === 'volunteer').length,
      donor: allUsers.filter((u) => u.role === 'donor').length,
      beneficiary: allUsers.filter((u) => u.role === 'beneficiary').length,
      guest: allUsers.filter((u) => u.role === 'guest').length
    };

    const overallPending = findHelpStats.pending + fundRaiseStats.pending + volunteerStats.pending;
    const overallApproved = findHelpStats.approved + fundRaiseStats.approved + volunteerStats.approved;
    const overallRejected = findHelpStats.rejected + fundRaiseStats.rejected + volunteerStats.rejected;
    const overallTotal = findHelpStats.total + fundRaiseStats.total + volunteerStats.total;

    return res.status(200).json({
      success: true,
      stats: {
        summary: {
          pending: overallPending,
          approved: overallApproved,
          rejected: overallRejected,
          total: overallTotal
        },
        findHelp: findHelpStats,
        fundRaise: fundRaiseStats,
        volunteer: volunteerStats,
        users: userRoleCounts
      }
    });
  } catch (err) {
    console.error('[requestController.getAdminStats] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to compute admin statistics.' });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = userModel.getAllSafeUsers();
    return res.status(200).json({ success: true, users, total: users.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

// PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required.' });
    }

    const updated = userModel.updateUserRole(id, role.toLowerCase());
    return res.status(200).json({
      success: true,
      message: `User role updated to ${role.toUpperCase()}.`,
      user: updated
    });
  } catch (err) {
    if (err.message === 'PRIMARY_ADMIN_CANNOT_BE_DEMOTED') {
      return res.status(403).json({ success: false, message: 'The primary project administrator role cannot be demoted.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  // Public & User methods
  submitFindHelp,
  getMyFindHelpRequests,
  trackFindHelpRequest,
  submitFundRaise,
  getMyFundRaiseRequests,
  getApprovedFundraisers,
  submitVolunteerApplication,
  getMyVolunteerApplications,
  logVolunteerHours,

  // Admin methods
  getAllFindHelpRequests,
  getFindHelpRequestById,
  updateFindHelpStatus,
  getAllFundRaiseRequests,
  updateFundRaiseStatus,
  getAllVolunteerApplications,
  updateVolunteerStatus,
  getAdminStats,
  getAllUsers,
  updateUserRole
};
