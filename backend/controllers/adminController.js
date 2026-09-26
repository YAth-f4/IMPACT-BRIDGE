const userModel = require('../models/userModel');
const ngoModel = require('../models/ngoModel');
const findHelpModel = require('../models/findHelpRequestModel');
const fundRaiseModel = require('../models/fundRaiseRequestModel');
const volunteerAppModel = require('../models/volunteerApplicationModel');
const donationModel = require('../models/donationModel');
const programModel = require('../models/programModel');
const messageModel = require('../models/messageModel');
const verifiedHubModel = require('../models/verifiedHubModel');
const auditLogModel = require('../models/auditLogModel');

/**
 * =========================================================================
 * 1. ADMIN DASHBOARD SUMMARY
 * GET /api/admin/dashboard
 * Real data computed from persistent database collections
 * =========================================================================
 */
const getDashboardSummary = async (req, res) => {
  try {
    // 1. Users metrics
    const allUsers = userModel.loadUsers ? userModel.loadUsers() : userModel.getAllSafeUsers();
    const userMetrics = {
      total: allUsers.length,
      volunteers: allUsers.filter((u) => u.role === 'volunteer').length,
      beneficiaries: allUsers.filter((u) => u.role === 'beneficiary').length,
      donors: allUsers.filter((u) => u.role === 'donor').length,
      admins: allUsers.filter((u) => u.role === 'admin').length
    };

    // 2. NGO metrics
    const ngoStats = ngoModel.getStats();

    // 3. Help Requests metrics
    const helpRequestStats = findHelpModel.getStats();

    // 4. Fund Raises metrics
    const fundRaiseStats = fundRaiseModel.getStats();

    // 5. Donations metrics
    const donationStats = donationModel.getStats();

    // 6. Programs metrics
    const programStats = programModel.getStats();

    // 7. Recent activity (from persistent audit log and latest actions)
    const auditResult = auditLogModel.findAll({ limit: 10 });
    const recentActivity = auditResult.logs.map((log) => ({
      id: log.id,
      type: log.action,
      message: log.note || `${log.action} on ${log.targetType} (${log.targetId})`,
      adminName: log.adminName,
      targetType: log.targetType,
      targetId: log.targetId,
      createdAt: log.timestamp
    }));

    // 8. Pending Queue (sorted newest first, reasonable preview limit)
    const allNgos = ngoModel.loadNgos();
    const pendingNgos = allNgos
      .filter((n) => n.status === 'PENDING')
      .slice(0, 5)
      .map((n) => ({
        id: n.id,
        name: n.organizationName,
        type: n.ngoType,
        city: n.city,
        submittedAt: n.createdAt
      }));

    const allHelpRequests = findHelpModel.loadRequests();
    const pendingHelpRequests = allHelpRequests
      .filter((r) => r.status === 'PENDING')
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        requesterName: r.requesterName,
        category: r.category,
        city: r.city,
        urgency: r.urgency,
        submittedAt: r.createdAt
      }));

    const allFundRaises = fundRaiseModel.loadRequests();
    const pendingFundRaises = allFundRaises
      .filter((f) => f.status === 'PENDING')
      .slice(0, 5)
      .map((f) => ({
        id: f.id,
        title: f.title,
        category: f.category,
        targetAmount: f.targetAmount,
        submittedAt: f.createdAt
      }));

    // Volunteer Applications metrics and pending queue
    const allVolunteerApps = volunteerAppModel.loadApplications ? volunteerAppModel.loadApplications() : [];
    const volunteerStats = {
      total: allVolunteerApps.length,
      pending: allVolunteerApps.filter((a) => a.status === 'PENDING').length,
      approved: allVolunteerApps.filter((a) => a.status === 'APPROVED').length,
      rejected: allVolunteerApps.filter((a) => a.status === 'REJECTED').length
    };

    const pendingVolunteers = allVolunteerApps
      .filter((v) => v.status === 'PENDING')
      .slice(0, 5)
      .map((v) => ({
        id: v.id,
        name: v.name,
        city: v.city,
        skills: v.skills,
        submittedAt: v.createdAt
      }));

    // Messages metrics
    const messageStats = messageModel.getStats();

    const data = {
      users: userMetrics,
      ngos: ngoStats,
      helpRequests: helpRequestStats,
      fundRaises: fundRaiseStats,
      donations: donationStats,
      programs: programStats,
      messages: messageStats,
      volunteers: volunteerStats,
      recentActivity,
      pendingQueue: {
        ngos: pendingNgos,
        helpRequests: pendingHelpRequests,
        fundRaises: pendingFundRaises,
        volunteers: pendingVolunteers
      }
    };

    // Backward-compatibility stats object for existing frontend/test consumers
    const legacyStats = {
      summary: {
        pending: helpRequestStats.pending + fundRaiseStats.pending + ngoStats.pending + volunteerStats.pending,
        approved: helpRequestStats.approved + fundRaiseStats.approved + ngoStats.approved + volunteerStats.approved,
        rejected: helpRequestStats.rejected + fundRaiseStats.rejected + ngoStats.rejected + volunteerStats.rejected,
        total: helpRequestStats.total + fundRaiseStats.total + ngoStats.total + volunteerStats.total
      },
      findHelp: helpRequestStats,
      fundRaise: fundRaiseStats,
      ngos: ngoStats,
      users: userMetrics,
      volunteer: volunteerStats,
      messages: messageStats
    };

    return res.status(200).json({
      success: true,
      data,
      stats: legacyStats
    });
  } catch (err) {
    console.error('[adminController.getDashboardSummary] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate administrative dashboard metrics.'
    });
  }
};

/**
 * =========================================================================
 * 2. USER MANAGEMENT
 * GET /api/admin/users
 * GET /api/admin/users/:id
 * PATCH /api/admin/users/:id/role
 * =========================================================================
 */
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    let safeUsers = userModel.getAllSafeUsers();

    // Filter by role (case-insensitive)
    if (role && role !== 'ALL') {
      const targetRole = String(role).toLowerCase().trim();
      safeUsers = safeUsers.filter((u) => u.role.toLowerCase() === targetRole);
    }

    // Filter by search query (name or email)
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      safeUsers = safeUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
      );
    }

    const total = safeUsers.length;
    const startIndex = (page - 1) * limit;
    const paginated = safeUsers.slice(startIndex, startIndex + Number(limit));

    return res.status(200).json({
      success: true,
      data: {
        users: paginated,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      },
      users: paginated,
      total
    });
  } catch (err) {
    console.error('[adminController.getUsers] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const safeUser = userModel.toSafeUser(user);
    return res.status(200).json({
      success: true,
      data: safeUser,
      user: safeUser
    });
  } catch (err) {
    console.error('[adminController.getUserById] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user.' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role parameter is required.' });
    }

    const targetRole = String(role).toLowerCase().trim();
    const validRoles = ['admin', 'volunteer', 'beneficiary', 'donor'];
    if (!validRoles.includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Valid roles are: ${validRoles.join(', ')}`
      });
    }

    const existingUser = userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const prevRole = existingUser.role;
    const updated = userModel.updateUserRole(id, targetRole);

    auditLogModel.log({
      adminUser: req.user,
      action: 'USER_ROLE_UPDATED',
      targetType: 'USER',
      targetId: id,
      previousStatus: prevRole,
      newStatus: targetRole,
      note: `Updated user role from ${prevRole} to ${targetRole}`
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${targetRole.toUpperCase()}.`,
      data: updated,
      user: updated
    });
  } catch (err) {
    if (err.message === 'PRIMARY_ADMIN_CANNOT_BE_DEMOTED') {
      return res.status(403).json({
        success: false,
        message: 'The primary project administrator role cannot be demoted.'
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * =========================================================================
 * 3. NGO ADMIN MANAGEMENT
 * GET /api/admin/ngos
 * GET /api/admin/ngos/:id
 * PATCH /api/admin/ngos/:id/status
 * =========================================================================
 */
const getNgos = async (req, res) => {
  try {
    const { status, search, city, cause, page = 1, limit = 50 } = req.query;
    let ngos = ngoModel.loadNgos();

    if (status && status !== 'ALL' && status !== 'null' && status !== 'undefined') {
      ngos = ngos.filter((n) => n.status.toUpperCase() === status.toUpperCase());
    }

    if (city && city !== 'ALL') {
      ngos = ngos.filter((n) => n.city.toLowerCase() === city.toLowerCase());
    }

    if (cause && cause !== 'ALL') {
      ngos = ngos.filter(
        (n) => Array.isArray(n.causes) && n.causes.some((c) => c.toLowerCase() === cause.toLowerCase())
      );
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      ngos = ngos.filter(
        (n) =>
          n.organizationName.toLowerCase().includes(q) ||
          n.city.toLowerCase().includes(q) ||
          n.state.toLowerCase().includes(q) ||
          (n.registrationNumber && n.registrationNumber.toLowerCase().includes(q)) ||
          n.contactEmail.toLowerCase().includes(q) ||
          (n.authorizedRepresentative && n.authorizedRepresentative.toLowerCase().includes(q))
      );
    }

    ngos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = ngos.length;
    const startIndex = (page - 1) * limit;
    const paginated = ngos.slice(startIndex, startIndex + Number(limit));

    const allNgos = ngoModel.loadNgos();
    const counts = {
      pending: allNgos.filter((n) => n.status === 'PENDING').length,
      approved: allNgos.filter((n) => n.status === 'APPROVED').length,
      rejected: allNgos.filter((n) => n.status === 'REJECTED').length,
      needsInfo: allNgos.filter((n) => n.status === 'NEEDS_INFO').length
    };

    return res.status(200).json({
      success: true,
      data: {
        ngos: paginated,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      },
      ngos,
      total,
      counts
    });
  } catch (err) {
    console.error('[adminController.getNgos] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve NGOs.' });
  }
};

const getNgoById = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = ngoModel.findById(id);
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO record not found.' });
    }
    return res.status(200).json({
      success: true,
      data: ngo,
      ngo
    });
  } catch (err) {
    console.error('[adminController.getNgoById] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve NGO record.' });
  }
};

const updateNgoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, notes, reviewNotes } = req.body;

    const reviewNote = note || notes || reviewNotes || '';

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.', error: 'Status is required.' });
    }

    let cleanStatus = String(status).toUpperCase().trim();
    if (cleanStatus === 'APPROVE') cleanStatus = 'APPROVED';
    if (cleanStatus === 'REJECT') cleanStatus = 'REJECTED';
    if (cleanStatus === 'NEED_INFO' || cleanStatus === 'NEEDSINFO') cleanStatus = 'NEEDS_INFO';

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO'];
    if (!validStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existingNgo = ngoModel.findById(id);
    if (!existingNgo) {
      return res.status(404).json({ success: false, message: 'NGO record not found.' });
    }

    const previousStatus = existingNgo.status;

    // Use authentic authenticated admin's identity
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };

    const updated = ngoModel.updateStatus(id, cleanStatus, adminUser, reviewNote);

    // Structure adminReview consistently
    updated.adminReview = {
      reviewedBy: `${adminUser.name} (${adminUser.id})`,
      reviewedAt: new Date().toISOString(),
      status: cleanStatus,
      note: reviewNote,
      notes: reviewNote,
      reviewNotes: reviewNote
    };
    ngoModel.saveNgos(ngoModel.loadNgos().map((n) => (n.id === id ? updated : n)));

    // Audit log
    auditLogModel.log({
      adminUser: req.user,
      action: `NGO_${cleanStatus}`,
      targetType: 'NGO',
      targetId: id,
      previousStatus,
      newStatus: cleanStatus,
      note: reviewNote || `NGO verification status updated to ${cleanStatus}`
    });

    return res.status(200).json({
      success: true,
      message: `NGO registration ${id} has been marked as ${cleanStatus}.`,
      data: updated,
      ngo: updated
    });
  } catch (err) {
    console.error('[adminController.updateNgoStatus] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * =========================================================================
 * 4. FIND HELP REQUEST MANAGEMENT
 * GET /api/admin/help-requests
 * GET /api/admin/help-requests/:id
 * PATCH /api/admin/help-requests/:id/status
 * =========================================================================
 */
const getHelpRequests = async (req, res) => {
  try {
    const { status, category, urgency, search, page = 1, limit = 50 } = req.query;
    const result = findHelpModel.findAll({
      status,
      category,
      urgency,
      search,
      page: Number(page),
      limit: Number(limit)
    });

    return res.status(200).json({
      success: true,
      data: {
        helpRequests: result.requests,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      },
      requests: result.requests,
      total: result.total
    });
  } catch (err) {
    console.error('[adminController.getHelpRequests] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve help requests.' });
  }
};

const getHelpRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = findHelpModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Help request not found.' });
    }
    return res.status(200).json({
      success: true,
      data: request,
      request
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve help request.' });
  }
};

const updateHelpRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const cleanStatus = String(status).toUpperCase();
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO'];
    if (!validStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existing = findHelpModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Help request not found.' });
    }

    const previousStatus = existing.status;
    const updated = findHelpModel.updateStatus(id, cleanStatus, req.user, note);

    auditLogModel.log({
      adminUser: req.user,
      action: `HELP_REQUEST_${cleanStatus}`,
      targetType: 'HELP_REQUEST',
      targetId: id,
      previousStatus,
      newStatus: cleanStatus,
      note: note || `Help request transitioned to ${cleanStatus}`
    });

    return res.status(200).json({
      success: true,
      message: `Help request ${id} updated to ${cleanStatus}.`,
      data: updated,
      request: updated
    });
  } catch (err) {
    console.error('[adminController.updateHelpRequestStatus] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * =========================================================================
 * 5. FUND RAISE MANAGEMENT
 * GET /api/admin/fund-raises
 * GET /api/admin/fund-raises/:id
 * PATCH /api/admin/fund-raises/:id/status
 * =========================================================================
 */
const getFundRaises = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const result = fundRaiseModel.findAll({
      status,
      category,
      search,
      page: Number(page),
      limit: Number(limit)
    });

    return res.status(200).json({
      success: true,
      data: {
        fundRaises: result.requests,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      },
      requests: result.requests,
      campaigns: result.requests,
      total: result.total
    });
  } catch (err) {
    console.error('[adminController.getFundRaises] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve fund raises.' });
  }
};

const getFundRaiseById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = fundRaiseModel.findById(id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Fund raise campaign not found.' });
    }
    return res.status(200).json({
      success: true,
      data: campaign,
      campaign
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve campaign.' });
  }
};

const updateFundRaiseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const cleanStatus = String(status).toUpperCase();
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO'];
    if (!validStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existing = fundRaiseModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Fund raise campaign not found.' });
    }

    const previousStatus = existing.status;
    const updated = fundRaiseModel.updateStatus(id, cleanStatus, req.user, note);

    auditLogModel.log({
      adminUser: req.user,
      action: `FUND_RAISE_${cleanStatus}`,
      targetType: 'FUND_RAISE',
      targetId: id,
      previousStatus,
      newStatus: cleanStatus,
      note: note || `Fund raise campaign transitioned to ${cleanStatus}`
    });

    return res.status(200).json({
      success: true,
      message: `Fund raise campaign ${id} updated to ${cleanStatus}.`,
      data: updated,
      campaign: updated
    });
  } catch (err) {
    console.error('[adminController.updateFundRaiseStatus] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * =========================================================================
 * 6. DONATIONS
 * GET /api/admin/donations
 * =========================================================================
 */
const getDonations = async (req, res) => {
  try {
    const { status, programId, search, page = 1, limit = 50 } = req.query;
    const result = donationModel.findAll({
      status,
      programId,
      search,
      page: Number(page),
      limit: Number(limit)
    });
    const stats = donationModel.getStats();

    return res.status(200).json({
      success: true,
      data: {
        donations: result.donations,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalCount: stats.totalCount,
        totalAmount: stats.totalAmount
      },
      donations: result.donations,
      totalCount: stats.totalCount,
      totalAmount: stats.totalAmount
    });
  } catch (err) {
    console.error('[adminController.getDonations] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve donations.' });
  }
};

const createDonation = async (req, res) => {
  try {
    const { donorName, email, phone, amount, purpose, paymentMethod, donorType, panNumber, message, programId } = req.body;
    if (!donorName || !String(donorName).trim()) {
      return res.status(400).json({ success: false, message: 'Donor name is required.' });
    }
    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({ success: false, message: 'Valid donation amount is required.' });
    }
    const created = donationModel.create({
      donorName,
      email: email || 'offline@impactbridge.org',
      phone,
      amount: parsedAmount,
      purpose: purpose || 'General Impact Fund',
      paymentMethod: paymentMethod || 'Cheque / Offline Wire',
      donorType: donorType || 'Individual Philanthropist',
      panNumber,
      message,
      programId
    });

    auditLogModel.log({
      adminUser: req.user,
      action: 'DONATION_RECORDED_OFFLINE',
      targetType: 'DONATION',
      targetId: created.id,
      note: `Recorded offline donation of ₹${parsedAmount} from ${created.donorName}`
    });

    return res.status(201).json({
      success: true,
      message: 'Offline donation recorded successfully.',
      donation: created,
      data: created
    });
  } catch (err) {
    console.error('[adminController.createDonation] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to record donation.' });
  }
};

/**
 * =========================================================================
 * 7. PROGRAM MANAGEMENT
 * GET /api/admin/programs
 * GET /api/admin/programs/:id
 * POST /api/admin/programs
 * PUT /api/admin/programs/:id
 * DELETE /api/admin/programs/:id
 * =========================================================================
 */
const getPrograms = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 50 } = req.query;
    const result = programModel.findAll({
      category,
      status,
      search,
      page: Number(page),
      limit: Number(limit)
    });
    const stats = programModel.getStats();

    return res.status(200).json({
      success: true,
      data: {
        programs: result.programs,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        active: stats.active
      },
      programs: result.programs,
      total: result.total
    });
  } catch (err) {
    console.error('[adminController.getPrograms] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve programs.' });
  }
};

const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = programModel.findById(id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }
    return res.status(200).json({
      success: true,
      data: program,
      program
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve program.' });
  }
};

const createProgram = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Program title is required.' });
    }

    const created = programModel.create(req.body);

    auditLogModel.log({
      adminUser: req.user,
      action: 'PROGRAM_CREATED',
      targetType: 'PROGRAM',
      targetId: created.id,
      note: `Created new program: "${created.title}"`
    });

    return res.status(201).json({
      success: true,
      message: 'Program created successfully.',
      data: created,
      program: created
    });
  } catch (err) {
    console.error('[adminController.createProgram] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = programModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    const updated = programModel.update(id, req.body);

    auditLogModel.log({
      adminUser: req.user,
      action: 'PROGRAM_UPDATED',
      targetType: 'PROGRAM',
      targetId: id,
      note: `Updated program: "${updated.title}"`
    });

    return res.status(200).json({
      success: true,
      message: 'Program updated successfully.',
      data: updated,
      program: updated
    });
  } catch (err) {
    console.error('[adminController.updateProgram] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = programModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    const deleted = programModel.delete(id);

    auditLogModel.log({
      adminUser: req.user,
      action: 'PROGRAM_DELETED',
      targetType: 'PROGRAM',
      targetId: id,
      note: `Deleted program: "${deleted.title}"`
    });

    return res.status(200).json({
      success: true,
      message: 'Program deleted successfully.',
      data: deleted,
      program: deleted
    });
  } catch (err) {
    console.error('[adminController.deleteProgram] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * =========================================================================
 * 8. MESSAGES / CONTACT REQUESTS
 * GET /api/admin/messages
 * GET /api/admin/messages/:id
 * PATCH /api/admin/messages/:id/status
 * =========================================================================
 */
const getMessages = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const result = messageModel.findAll({
      status,
      category,
      search,
      page: Number(page),
      limit: Number(limit)
    });
    const stats = messageModel.getStats();

    return res.status(200).json({
      success: true,
      data: {
        messages: result.messages,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        stats
      },
      messages: result.messages,
      total: result.total,
      stats
    });
  } catch (err) {
    console.error('[adminController.getMessages] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
};

const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = messageModel.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    return res.status(200).json({
      success: true,
      data: message,
      message
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve message.' });
  }
};

const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const cleanStatus = String(status).toUpperCase();
    const validStatuses = ['UNREAD', 'READ', 'RESOLVED'];
    if (!validStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid message status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existing = messageModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    const previousStatus = existing.status;
    const updated = messageModel.updateStatus(id, cleanStatus, req.user, note);

    auditLogModel.log({
      adminUser: req.user,
      action: `MESSAGE_${cleanStatus}`,
      targetType: 'MESSAGE',
      targetId: id,
      previousStatus,
      newStatus: cleanStatus,
      note: note || `Message marked as ${cleanStatus}`
    });

    return res.status(200).json({
      success: true,
      message: `Message ${id} status updated to ${cleanStatus}.`,
      data: updated,
      message: updated
    });
  } catch (err) {
    console.error('[adminController.updateMessageStatus] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = messageModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    const deleted = messageModel.delete(id);

    auditLogModel.log({
      adminUser: req.user,
      action: 'MESSAGE_DELETED',
      targetType: 'MESSAGE',
      targetId: id,
      note: `Deleted message from ${existing.senderName}`
    });

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
      data: deleted
    });
  } catch (err) {
    console.error('[adminController.deleteMessage] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
};

/**
 * =========================================================================
 * 9. VERIFIED HUB MANAGEMENT
 * GET /api/admin/verified-hubs
 * GET /api/admin/verified-hubs/:id
 * POST /api/admin/verified-hubs
 * PUT /api/admin/verified-hubs/:id
 * DELETE /api/admin/verified-hubs/:id
 * =========================================================================
 */
const getVerifiedHubs = async (req, res) => {
  try {
    const { city, category, status, search, page = 1, limit = 50 } = req.query;
    const result = verifiedHubModel.findAll({
      city,
      category,
      status,
      search,
      page: Number(page),
      limit: Number(limit)
    });
    const stats = verifiedHubModel.getStats();

    return res.status(200).json({
      success: true,
      data: {
        hubs: result.hubs,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        active: stats.active
      },
      hubs: result.hubs,
      total: result.total
    });
  } catch (err) {
    console.error('[adminController.getVerifiedHubs] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve verified hubs.' });
  }
};

const getVerifiedHubById = async (req, res) => {
  try {
    const { id } = req.params;
    const hub = verifiedHubModel.findById(id);
    if (!hub) {
      return res.status(404).json({ success: false, message: 'Verified hub not found.' });
    }
    return res.status(200).json({
      success: true,
      data: hub,
      hub
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve verified hub.' });
  }
};

const createVerifiedHub = async (req, res) => {
  try {
    const { name, city } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Hub name is required.' });
    }
    if (!city || !String(city).trim()) {
      return res.status(400).json({ success: false, message: 'Hub city is required.' });
    }

    const created = verifiedHubModel.createVerifiedHub(req.body);

    auditLogModel.log({
      adminUser: req.user,
      action: 'VERIFIED_HUB_CREATED',
      targetType: 'VERIFIED_HUB',
      targetId: created.id,
      note: `Created Verified Hub: "${created.name}" in ${created.city}`
    });

    return res.status(201).json({
      success: true,
      message: 'Verified hub created successfully.',
      data: created,
      hub: created
    });
  } catch (err) {
    console.error('[adminController.createVerifiedHub] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateVerifiedHub = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = verifiedHubModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Verified hub not found.' });
    }

    const updated = verifiedHubModel.updateVerifiedHub(id, req.body);

    auditLogModel.log({
      adminUser: req.user,
      action: 'VERIFIED_HUB_UPDATED',
      targetType: 'VERIFIED_HUB',
      targetId: id,
      note: `Updated Verified Hub: "${updated.name}"`
    });

    return res.status(200).json({
      success: true,
      message: 'Verified hub updated successfully.',
      data: updated,
      hub: updated
    });
  } catch (err) {
    console.error('[adminController.updateVerifiedHub] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteVerifiedHub = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = verifiedHubModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Verified hub not found.' });
    }

    const deleted = verifiedHubModel.deleteVerifiedHub(id);

    auditLogModel.log({
      adminUser: req.user,
      action: 'VERIFIED_HUB_DELETED',
      targetType: 'VERIFIED_HUB',
      targetId: id,
      note: `Deleted Verified Hub: "${deleted.name}"`
    });

    return res.status(200).json({
      success: true,
      message: 'Verified hub deleted successfully.',
      data: deleted,
      hub: deleted
    });
  } catch (err) {
    console.error('[adminController.deleteVerifiedHub] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * =========================================================================
 * 10. ADMIN AUDIT LOGS
 * GET /api/admin/audit-logs
 * =========================================================================
 */
const getAuditLogs = async (req, res) => {
  try {
    const { action, targetType, search, page = 1, limit = 50 } = req.query;
    const result = auditLogModel.findAll({
      action,
      targetType,
      search,
      page: Number(page),
      limit: Number(limit)
    });

    return res.status(200).json({
      success: true,
      data: {
        logs: result.logs,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      },
      logs: result.logs,
      total: result.total
    });
  } catch (err) {
    console.error('[adminController.getAuditLogs] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve audit logs.' });
  }
};

/**
 * =========================================================================
 * 11. VOLUNTEER APPLICATIONS (BACKWARD COMPATIBILITY)
 * GET /api/admin/volunteers
 * PATCH /api/admin/volunteers/:id/status
 * =========================================================================
 */
const getVolunteerApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const result = volunteerAppModel.findAll({
      status,
      search,
      page: Number(page),
      limit: Number(limit)
    });

    return res.status(200).json({
      success: true,
      data: {
        applications: result.applications,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      },
      applications: result.applications,
      total: result.total
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve volunteer applications.' });
  }
};

const updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const updated = volunteerAppModel.updateStatus(id, status, req.user, note);

    auditLogModel.log({
      adminUser: req.user,
      action: `VOLUNTEER_${status.toUpperCase()}`,
      targetType: 'VOLUNTEER_APPLICATION',
      targetId: id,
      newStatus: status.toUpperCase(),
      note: note || `Volunteer application status updated to ${status}`
    });

    return res.status(200).json({
      success: true,
      message: `Volunteer application ${id} updated to ${status}.`,
      data: updated,
      application: updated
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboardSummary,
  getUsers,
  getUserById,
  updateUserRole,
  getNgos,
  getNgoById,
  updateNgoStatus,
  getHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus,
  getFundRaises,
  getFundRaiseById,
  updateFundRaiseStatus,
  getDonations,
  createDonation,
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getVerifiedHubs,
  getVerifiedHubById,
  createVerifiedHub,
  updateVerifiedHub,
  deleteVerifiedHub,
  getAuditLogs,
  getVolunteerApplications,
  updateVolunteerStatus
};
