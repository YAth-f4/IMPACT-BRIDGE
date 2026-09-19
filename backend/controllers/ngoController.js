const fs = require('fs');
const path = require('path');
const ngoModel = require('../models/ngoModel');

// Upload directory for certificates and logos
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'public', 'uploads', 'ngos');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed MIME types and max size (5 MB)
const ALLOWED_MIME_TYPES = {
  'data:image/jpeg;base64': '.jpg',
  'data:image/jpg;base64': '.jpg',
  'data:image/png;base64': '.png',
  'data:image/webp;base64': '.webp',
  'data:application/pdf;base64': '.pdf'
};
const MAX_BASE64_LENGTH = 7 * 1024 * 1024; // ~5MB file

/**
 * Helper to process and safely persist base64 file payloads
 */
const saveBase64File = (dataUrl, prefix = 'doc') => {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  if (!dataUrl.startsWith('data:')) return dataUrl; // Already a URL / path

  if (dataUrl.length > MAX_BASE64_LENGTH) {
    throw new Error('FILE_TOO_LARGE');
  }

  const [header, base64Data] = dataUrl.split(',');
  if (!header || !base64Data) {
    throw new Error('INVALID_FILE_FORMAT');
  }

  const cleanHeader = header.toLowerCase();
  const matchedMime = Object.keys(ALLOWED_MIME_TYPES).find((m) => cleanHeader.startsWith(m.split(';')[0]));
  if (!matchedMime) {
    throw new Error('UNSUPPORTED_FILE_TYPE');
  }

  const ext = ALLOWED_MIME_TYPES[matchedMime];
  const safeFilename = `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}${ext}`;
  const targetPath = path.join(UPLOAD_DIR, safeFilename);

  fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
  return `/uploads/ngos/${safeFilename}`;
};

// Validation helpers
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
const isValidPhone = (phone) => /^[+]?[\d\s-]{8,15}$/.test(String(phone).trim());

/**
 * POST /api/ngos (Authenticated NGO Representative)
 * Submits NGO for verification review. Initial status is always PENDING.
 */
const submitNgo = async (req, res) => {
  try {
    const {
      organizationName,
      description,
      ngoType,
      founder,
      authorizedRepresentative,
      contactEmail,
      phone,
      website,
      address,
      city,
      state,
      pincode,
      registrationNumber,
      registrationCertificate,
      logo,
      photos,
      causes,
      areasOfWork,
      programs,
      yearsOfOperation
    } = req.body;

    // Required fields validation
    if (!organizationName || !String(organizationName).trim()) {
      return res.status(400).json({ success: false, message: 'Organization name is required.' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a brief description of the organization.' });
    }
    if (!contactEmail || !isValidEmail(contactEmail)) {
      return res.status(400).json({ success: false, message: 'A valid official contact email address is required.' });
    }
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ success: false, message: 'A valid telephone / mobile helpline number is required.' });
    }
    if (!address || !String(address).trim()) {
      return res.status(400).json({ success: false, message: 'Full physical registered address is required.' });
    }
    if (!city || !String(city).trim()) {
      return res.status(400).json({ success: false, message: 'City is required.' });
    }
    if (!state || !String(state).trim()) {
      return res.status(400).json({ success: false, message: 'State / Union Territory is required.' });
    }
    if (!pincode || !String(pincode).trim()) {
      return res.status(400).json({ success: false, message: 'Valid postal PIN Code is required.' });
    }
    if (!registrationNumber || !String(registrationNumber).trim()) {
      return res.status(400).json({ success: false, message: 'Statutory NGO Registration Number is required.' });
    }
    if (!registrationCertificate) {
      return res.status(400).json({ success: false, message: 'Registration certificate document upload is required.' });
    }

    // Process and sanitize file uploads
    let certificateUrl = '';
    let logoUrl = '';
    let photoUrls = [];

    try {
      certificateUrl = saveBase64File(registrationCertificate, 'cert');
      if (logo) logoUrl = saveBase64File(logo, 'logo');
      if (Array.isArray(photos)) {
        photoUrls = photos.map((p, idx) => saveBase64File(p, `photo-${idx}`));
      }
    } catch (uploadErr) {
      if (uploadErr.message === 'FILE_TOO_LARGE') {
        return res.status(400).json({ success: false, message: 'Uploaded file size exceeds the 5MB limit.' });
      }
      if (uploadErr.message === 'UNSUPPORTED_FILE_TYPE') {
        return res.status(400).json({ success: false, message: 'Unsupported file type. Please upload a PDF, PNG, JPG, or WebP document.' });
      }
      return res.status(400).json({ success: false, message: 'Failed to process document uploads.' });
    }

    // Create record with atomic persistence
    try {
      const newNgo = ngoModel.create({
        organizationName,
        description,
        ngoType: ngoType || 'Trust',
        founder: founder || '',
        authorizedRepresentative: authorizedRepresentative || req.user.name,
        contactEmail: contactEmail.toLowerCase(),
        phone,
        website: website || '',
        address,
        city,
        state,
        pincode,
        registrationNumber,
        registrationCertificate: certificateUrl,
        logo: logoUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
        photos: photoUrls,
        causes: Array.isArray(causes) ? causes : (typeof causes === 'string' ? causes.split(',').map((s) => s.trim()).filter(Boolean) : []),
        areasOfWork: Array.isArray(areasOfWork) ? areasOfWork : (typeof areasOfWork === 'string' ? areasOfWork.split(',').map((s) => s.trim()).filter(Boolean) : []),
        programs: Array.isArray(programs) ? programs : (typeof programs === 'string' ? programs.split(',').map((s) => s.trim()).filter(Boolean) : []),
        yearsOfOperation: Number(yearsOfOperation) || 1,
        ownerUserId: req.user.id,
        submittedBy: `${req.user.name} (${req.user.email})`
      });

      return res.status(201).json({
        success: true,
        message: 'NGO registration submitted successfully. Your application is currently under review.',
        ngo: {
          id: newNgo.id,
          organizationName: newNgo.organizationName,
          status: newNgo.status,
          ownerUserId: newNgo.ownerUserId,
          createdAt: newNgo.createdAt
        }
      });
    } catch (modelErr) {
      if (modelErr.message === 'DUPLICATE_REGISTRATION_NUMBER') {
        return res.status(409).json({
          success: false,
          message: 'An NGO with this statutory registration number has already been registered or is currently under review.'
        });
      }
      throw modelErr;
    }
  } catch (err) {
    console.error('[ngoController.submitNgo] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error processing NGO registration.' });
  }
};

/**
 * GET /api/ngos (Public Directory of Verified Impact Bridge NGOs)
 * Strictly queries and returns ONLY NGOs whose status is APPROVED.
 */
const getPublicNgos = async (req, res) => {
  try {
    const { search, cause, city } = req.query;
    const approvedNgos = ngoModel.getAllApproved({ search, cause, city });

    return res.status(200).json({
      success: true,
      count: approvedNgos.length,
      ngos: approvedNgos
    });
  } catch (err) {
    console.error('[ngoController.getPublicNgos] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Unable to load verified NGO directory.' });
  }
};

/**
 * GET /api/ngos/:id (Public / Verified Detail Page)
 * Returns public details for APPROVED NGOs (or owner / admin if not yet approved)
 */
const getPublicNgoById = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = ngoModel.findById(id);

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'Organization profile not found.' });
    }

    const isOwner = req.user && req.user.id === ngo.ownerUserId;
    const isAdmin = req.user && req.user.role === 'admin';

    // Non-approved NGOs are strictly hidden from the public unless requested by owner or admin
    if (ngo.status !== 'APPROVED' && !isOwner && !isAdmin) {
      return res.status(404).json({ success: false, message: 'Organization profile not found or pending verification.' });
    }

    // Public sanitized representation (excluding internal admin audit notes unless owner/admin)
    const sanitized = {
      id: ngo.id,
      organizationName: ngo.organizationName,
      description: ngo.description,
      ngoType: ngo.ngoType,
      founder: ngo.founder,
      authorizedRepresentative: ngo.authorizedRepresentative,
      contactEmail: ngo.contactEmail,
      phone: ngo.phone,
      website: ngo.website,
      address: ngo.address,
      city: ngo.city,
      state: ngo.state,
      pincode: ngo.pincode,
      registrationNumber: ngo.registrationNumber,
      logo: ngo.logo,
      photos: ngo.photos,
      causes: ngo.causes,
      areasOfWork: ngo.areasOfWork,
      programs: ngo.programs,
      yearsOfOperation: ngo.yearsOfOperation,
      isVerified: ngo.status === 'APPROVED',
      status: ngo.status,
      createdAt: ngo.createdAt,
      // Include admin feedback only if owner or admin
      adminReview: isOwner || isAdmin ? ngo.adminReview : undefined
    };

    return res.status(200).json({ success: true, ngo: sanitized });
  } catch (err) {
    console.error('[ngoController.getPublicNgoById] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve organization profile.' });
  }
};

/**
 * GET /api/ngos/my (Authenticated NGO Owner)
 * Returns submissions owned by the currently authenticated user
 */
const getMyNgos = async (req, res) => {
  try {
    const userNgos = ngoModel.findByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      count: userNgos.length,
      ngos: userNgos
    });
  } catch (err) {
    console.error('[ngoController.getMyNgos] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Unable to retrieve your NGO registrations.' });
  }
};

/**
 * PUT /api/ngos/:id (Authenticated NGO Owner)
 * Updates submission details (e.g. when NEEDS_INFO or updating profile data)
 */
const updateMyNgo = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = ngoModel.findById(id);

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO record not found.' });
    }

    if (ngo.ownerUserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access forbidden. You do not own this NGO registration.' });
    }

    // Process new files if supplied as data URLs
    const updates = { ...req.body };
    if (updates.registrationCertificate && updates.registrationCertificate.startsWith('data:')) {
      updates.registrationCertificate = saveBase64File(updates.registrationCertificate, 'cert');
    }
    if (updates.logo && updates.logo.startsWith('data:')) {
      updates.logo = saveBase64File(updates.logo, 'logo');
    }

    const updated = ngoModel.updateNgo(id, updates, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'NGO details updated successfully.',
      ngo: updated
    });
  } catch (err) {
    if (err.message === 'UNAUTHORIZED_OWNER') {
      return res.status(403).json({ success: false, message: 'Unauthorized owner modification.' });
    }
    console.error('[ngoController.updateMyNgo] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to update NGO details.' });
  }
};

/**
 * POST /api/ngos/:id/resubmit (Authenticated NGO Owner)
 * Allows owner to resubmit an application flagged as NEEDS_INFO
 */
const resubmitNgo = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const ngo = ngoModel.findById(id);

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO record not found.' });
    }

    if (ngo.ownerUserId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access forbidden. You do not own this NGO registration.' });
    }

    if (ngo.status !== 'NEEDS_INFO') {
      return res.status(400).json({
        success: false,
        message: 'Resubmission is only permitted when your application status is NEEDS_INFO.'
      });
    }

    const updated = ngoModel.resubmit(id, req.user.id, note);
    return res.status(200).json({
      success: true,
      message: 'Your NGO application has been resubmitted and is now awaiting administrator review.',
      ngo: updated
    });
  } catch (err) {
    console.error('[ngoController.resubmitNgo] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to resubmit application.' });
  }
};

/**
 * =========================================================
 * ADMIN REVIEW ENDPOINTS (Strictly requireAdmin)
 * =========================================================
 */

/**
 * GET /api/admin/ngos
 */
const adminGetAllNgos = async (req, res) => {
  try {
    const { status } = req.query;
    const ngos = ngoModel.getAllAdmin(status);

    const pendingCount = ngos.filter((n) => n.status === 'PENDING').length;
    const approvedCount = ngos.filter((n) => n.status === 'APPROVED').length;
    const rejectedCount = ngos.filter((n) => n.status === 'REJECTED').length;
    const needsInfoCount = ngos.filter((n) => n.status === 'NEEDS_INFO').length;

    return res.status(200).json({
      success: true,
      total: ngos.length,
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        needsInfo: needsInfoCount
      },
      ngos
    });
  } catch (err) {
    console.error('[ngoController.adminGetAllNgos] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load NGO registrations.' });
  }
};

/**
 * GET /api/admin/ngos/:id
 */
const adminGetNgoById = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = ngoModel.findById(id);

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO registration not found.' });
    }

    return res.status(200).json({ success: true, ngo });
  } catch (err) {
    console.error('[ngoController.adminGetNgoById] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve NGO registration.' });
  }
};

/**
 * PATCH /api/admin/ngos/:id/status
 * Approves, rejects, or requests more information on an NGO registration
 */
const adminUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, reviewNotes } = req.body;
    const noteText = note || reviewNotes || '';

    if (!status || !['APPROVED', 'REJECTED', 'NEEDS_INFO'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status decision. Allowed choices: APPROVE, REJECT, or NEEDS_INFO.'
      });
    }

    const updated = ngoModel.updateStatus(id, status.toUpperCase(), req.user, noteText);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'NGO registration not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `NGO registration ${id} status successfully transitioned to ${status.toUpperCase()}.`,
      ngo: updated
    });
  } catch (err) {
    console.error('[ngoController.adminUpdateStatus] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to update NGO status.' });
  }
};

module.exports = {
  submitNgo,
  getPublicNgos,
  getPublicNgoById,
  getMyNgos,
  updateMyNgo,
  resubmitNgo,
  adminGetAllNgos,
  adminGetNgoById,
  adminUpdateStatus
};
