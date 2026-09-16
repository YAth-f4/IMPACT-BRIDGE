const aboutModel = require('../models/aboutModel');

/**
 * Validates a web image URL or relative path safely.
 * Disallows javascript:, data:, vbscript:, or executable links.
 */
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return true;
  const clean = url.trim().toLowerCase();
  if (!clean) return true;

  // Disallow potentially unsafe protocols
  if (clean.startsWith('javascript:') || clean.startsWith('data:') || clean.startsWith('vbscript:')) {
    return false;
  }

  // Allow standard web URLs or local paths
  return clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/');
};

/**
 * Validates a public source link URL.
 * Requires valid HTTP/HTTPS scheme.
 */
const isValidSourceUrl = (url) => {
  if (!url || typeof url !== 'string') return true;
  const clean = url.trim().toLowerCase();
  if (!clean) return true;
  return clean.startsWith('http://') || clean.startsWith('https://');
};

/**
 * Validates the complete About page payload.
 * Returns null if valid, or a descriptive error message string.
 */
const validateAboutPayload = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Invalid request payload: must be a JSON object.';
  }

  // Reject deprecated legacy fields
  if (body.timeline !== undefined || body.journey !== undefined || body.leadership !== undefined || body.leadershipTeam !== undefined) {
    return 'Fields "timeline", "journey", "leadership", and "leadershipTeam" have been deprecated and must not be included.';
  }

  // 1. Mission Validation
  if (!body.mission || typeof body.mission !== 'object' || Array.isArray(body.mission)) {
    return 'Field "mission" must be an object containing "title" and "description".';
  }
  const missionTitle = typeof body.mission.title === 'string' ? body.mission.title.trim() : '';
  const missionDesc = typeof body.mission.description === 'string' ? body.mission.description.trim() : '';
  if (!missionTitle) {
    return 'Mission title is required.';
  }
  if (missionTitle.length > 200) {
    return 'Mission title cannot exceed 200 characters.';
  }
  if (!missionDesc) {
    return 'Mission description is required.';
  }
  if (missionDesc.length > 2000) {
    return 'Mission description cannot exceed 2000 characters.';
  }

  // 2. Vision Validation
  if (!body.vision || typeof body.vision !== 'object' || Array.isArray(body.vision)) {
    return 'Field "vision" must be an object containing "title" and "description".';
  }
  const visionTitle = typeof body.vision.title === 'string' ? body.vision.title.trim() : '';
  const visionDesc = typeof body.vision.description === 'string' ? body.vision.description.trim() : '';
  if (!visionTitle) {
    return 'Vision title is required.';
  }
  if (visionTitle.length > 200) {
    return 'Vision title cannot exceed 200 characters.';
  }
  if (!visionDesc) {
    return 'Vision description is required.';
  }
  if (visionDesc.length > 2000) {
    return 'Vision description cannot exceed 2000 characters.';
  }

  // 3. Strategic Goals Validation
  if (body.strategicGoals !== undefined) {
    if (!Array.isArray(body.strategicGoals)) {
      return 'Field "strategicGoals" must be an array.';
    }
    for (let i = 0; i < body.strategicGoals.length; i++) {
      const goal = body.strategicGoals[i];
      if (!goal || typeof goal !== 'object') {
        return `Strategic goal at index ${i} must be an object.`;
      }
      const goalTitle = typeof goal.title === 'string' ? goal.title.trim() : '';
      if (!goalTitle) {
        return `Strategic goal at index ${i} is missing a title.`;
      }
      if (goalTitle.length > 200) {
        return `Strategic goal title at index ${i} exceeds 200 characters.`;
      }
      if (goal.description && typeof goal.description === 'string' && goal.description.length > 1000) {
        return `Strategic goal description at index ${i} exceeds 1000 characters.`;
      }
      if (goal.order !== undefined && (typeof goal.order !== 'number' || goal.order < 0 || isNaN(goal.order))) {
        return `Strategic goal order at index ${i} must be a non-negative number.`;
      }
    }
  }

  // 4. Approach Steps Validation
  if (body.approachSteps !== undefined) {
    if (!Array.isArray(body.approachSteps)) {
      return 'Field "approachSteps" must be an array.';
    }
    for (let i = 0; i < body.approachSteps.length; i++) {
      const step = body.approachSteps[i];
      if (!step || typeof step !== 'object') {
        return `Approach step at index ${i} must be an object.`;
      }
      if (step.stepNumber === undefined || step.stepNumber === null || isNaN(Number(step.stepNumber))) {
        return `Approach step at index ${i} requires a valid stepNumber.`;
      }
      const stepTitle = typeof step.title === 'string' ? step.title.trim() : '';
      if (!stepTitle) {
        return `Approach step at index ${i} is missing a title.`;
      }
      if (stepTitle.length > 200) {
        return `Approach step title at index ${i} exceeds 200 characters.`;
      }
      const stepDesc = typeof step.description === 'string' ? step.description.trim() : '';
      if (!stepDesc) {
        return `Approach step at index ${i} is missing a description.`;
      }
      if (stepDesc.length > 1000) {
        return `Approach step description at index ${i} exceeds 1000 characters.`;
      }
      if (step.order !== undefined && (typeof step.order !== 'number' || step.order < 0 || isNaN(step.order))) {
        return `Approach step order at index ${i} must be a non-negative number.`;
      }
    }
  }

  // 5. Inspiring Changemakers Validation
  if (body.inspiringChangemakers !== undefined) {
    if (!Array.isArray(body.inspiringChangemakers)) {
      return 'Field "inspiringChangemakers" must be an array.';
    }
    for (let i = 0; i < body.inspiringChangemakers.length; i++) {
      const c = body.inspiringChangemakers[i];
      if (!c || typeof c !== 'object') {
        return `Changemaker entry at index ${i} must be an object.`;
      }
      const name = typeof c.name === 'string' ? c.name.trim() : '';
      if (!name) {
        return `Changemaker entry at index ${i} is missing a name.`;
      }
      if (name.length > 150) {
        return `Changemaker name at index ${i} exceeds 150 characters.`;
      }

      const designation = typeof c.designation === 'string' ? c.designation.trim() : '';
      if (!designation) {
        return `Changemaker entry at index ${i} is missing a designation.`;
      }
      if (designation.length > 200) {
        return `Changemaker designation at index ${i} exceeds 200 characters.`;
      }

      const organization = typeof c.organization === 'string' ? c.organization.trim() : '';
      if (!organization) {
        return `Changemaker entry at index ${i} is missing an organization.`;
      }
      if (organization.length > 200) {
        return `Changemaker organization at index ${i} exceeds 200 characters.`;
      }

      const shortBio = typeof c.shortBio === 'string' ? c.shortBio.trim() : '';
      if (!shortBio) {
        return `Changemaker entry at index ${i} is missing a shortBio.`;
      }
      if (shortBio.length > 400) {
        return `Changemaker shortBio at index ${i} exceeds 400 characters.`;
      }

      const fullBio = typeof c.fullBio === 'string' ? c.fullBio.trim() : '';
      if (!fullBio) {
        return `Changemaker entry at index ${i} is missing a fullBio.`;
      }
      if (fullBio.length > 3000) {
        return `Changemaker fullBio at index ${i} exceeds 3000 characters.`;
      }

      if (c.achievements !== undefined) {
        if (!Array.isArray(c.achievements)) {
          return `Changemaker achievements at index ${i} must be an array of strings.`;
        }
        for (let j = 0; j < c.achievements.length; j++) {
          const ach = typeof c.achievements[j] === 'string' ? c.achievements[j].trim() : '';
          if (!ach) {
            return `Achievement item ${j} for changemaker "${name}" cannot be empty.`;
          }
          if (ach.length > 400) {
            return `Achievement item ${j} for changemaker "${name}" exceeds 400 characters.`;
          }
        }
      }

      const impactArea = typeof c.impactArea === 'string' ? c.impactArea.trim() : '';
      if (!impactArea) {
        return `Changemaker entry at index ${i} is missing an impactArea.`;
      }
      if (impactArea.length > 150) {
        return `Changemaker impactArea at index ${i} exceeds 150 characters.`;
      }

      if (c.slug !== undefined && c.slug !== null) {
        if (typeof c.slug !== 'string' || !c.slug.trim()) {
          return `Changemaker slug at index ${i} must be a non-empty string.`;
        }
        const cleanSlug = c.slug.trim().toLowerCase();
        if (cleanSlug.length > 100) {
          return `Changemaker slug at index ${i} exceeds 100 characters.`;
        }
        if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
          return `Changemaker slug at index ${i} must only contain lowercase alphanumeric characters and hyphens.`;
        }
      }

      if (c.imageUrl && !isValidImageUrl(c.imageUrl)) {
        return `Changemaker image at index ${i} must be a valid HTTP/HTTPS URL or safe path.`;
      }

      if (c.sourceUrl && !isValidSourceUrl(c.sourceUrl)) {
        return `Changemaker sourceUrl at index ${i} must be a valid HTTP/HTTPS URL.`;
      }

      if (c.order !== undefined && (typeof c.order !== 'number' || c.order < 0 || isNaN(c.order))) {
        return `Changemaker order at index ${i} must be a non-negative number.`;
      }
    }

    // Enforce unique slugs across changemakers
    const seenSlugs = new Set();
    for (let i = 0; i < body.inspiringChangemakers.length; i++) {
      const c = body.inspiringChangemakers[i];
      const s = (c.slug ? String(c.slug).trim().toLowerCase() : '') ||
                (c.name ? String(c.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '');
      if (s) {
        if (seenSlugs.has(s)) {
          return `Duplicate changemaker slug "${s}" detected. Each changemaker must have a unique slug.`;
        }
        seenSlugs.add(s);
      }
    }
  }

  return null;
};

/**
 * GET /api/about
 * Public endpoint to fetch full About page content.
 */
const getAbout = (req, res) => {
  try {
    const data = aboutModel.getContent();
    return res.status(200).json({
      success: true,
      data: {
        mission: data.mission || {},
        vision: data.vision || {},
        strategicGoals: data.strategicGoals || [],
        approachSteps: data.approachSteps || [],
        inspiringChangemakers: data.inspiringChangemakers || []
      }
    });
  } catch (err) {
    console.error('[aboutController.getAbout] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve About page content.'
    });
  }
};

/**
 * GET /api/admin/about
 * Protected endpoint for administrators to view current About content with full metadata.
 */
const getAdminAbout = (req, res) => {
  try {
    const data = aboutModel.getContent();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error('[aboutController.getAdminAbout] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve About page admin content.'
    });
  }
};

/**
 * PUT /api/admin/about
 * Protected endpoint for administrators to update About page content.
 * Performs rigorous validation, sanitization, and atomic in-place update.
 */
const updateAbout = (req, res) => {
  try {
    // 1. Validate request body
    const validationError = validateAboutPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    // 2. Sanitize and update in singleton model
    const updated = aboutModel.updateContent(req.body);

    return res.status(200).json({
      success: true,
      message: 'About page content updated successfully.',
      data: updated
    });
  } catch (err) {
    console.error('[aboutController.updateAbout] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update About page content.'
    });
  }
};

/**
 * POST /api/admin/about/reset
 * Helper endpoint for administrators to restore verified baseline content.
 */
const resetAbout = (req, res) => {
  try {
    const reset = aboutModel.resetToDefault();
    return res.status(200).json({
      success: true,
      message: 'About page content reset to official default successfully.',
      data: reset
    });
  } catch (err) {
    console.error('[aboutController.resetAbout] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset About page content.'
    });
  }
};

/**
 * GET /api/about/changemakers/:slug
 * Public endpoint to fetch a single changemaker profile by slug.
 */
const getChangemakerProfile = (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'A valid changemaker slug is required.'
      });
    }

    const changemaker = aboutModel.getChangemakerBySlug(slug);
    if (!changemaker) {
      return res.status(404).json({
        success: false,
        message: `Changemaker with slug "${slug}" not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: changemaker
    });
  } catch (err) {
    console.error('[aboutController.getChangemakerProfile] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve changemaker profile.'
    });
  }
};

module.exports = {
  getAbout,
  getChangemakerProfile,
  getAdminAbout,
  updateAbout,
  resetAbout
};
