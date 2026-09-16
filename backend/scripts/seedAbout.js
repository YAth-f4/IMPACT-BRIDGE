/**
 * Development & Testing Seed Script for IMPACT BRIDGE About Page
 * 
 * Usage:
 *   node backend/scripts/seedAbout.js
 * 
 * Populates or resets backend/data/about.json with verified foundation data
 * and curated Inspiring Changemakers.
 */

const aboutModel = require('../models/aboutModel');

console.log('[Seed] Starting About page content seeding...');

try {
  const result = aboutModel.resetToDefault();
  console.log('✅ About page content successfully seeded/reset.');
  console.log(`📡 Mission: ${result.mission.title}`);
  console.log(`👁️ Vision: ${result.vision.title}`);
  console.log(`🎯 Strategic goals count: ${result.strategicGoals.length}`);
  console.log(`🪜 Approach steps count: ${result.approachSteps.length}`);
  console.log(`🌟 Inspiring changemakers count: ${result.inspiringChangemakers.length}`);
  console.log(`🕒 Updated At: ${result.updatedAt}`);
} catch (err) {
  console.error('❌ Failed to seed About page content:', err.message);
  process.exit(1);
}
