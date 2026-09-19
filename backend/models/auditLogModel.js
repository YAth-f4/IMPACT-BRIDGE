const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const AUDIT_LOGS_FILE = path.join(DATA_DIR, 'auditLogs.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class AuditLogModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(AUDIT_LOGS_FILE)) {
        fs.writeFileSync(AUDIT_LOGS_FILE, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[AuditLogModel] Error initializing auditLogs.json:', err.message);
    }
  }

  loadLogs() {
    try {
      if (!fs.existsSync(AUDIT_LOGS_FILE)) {
        return [];
      }
      const raw = fs.readFileSync(AUDIT_LOGS_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[AuditLogModel] Error reading auditLogs.json:', err.message);
      return [];
    }
  }

  saveLogs(logs) {
    try {
      fs.writeFileSync(AUDIT_LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('[AuditLogModel] Error saving auditLogs.json:', err.message);
      return false;
    }
  }

  log({ adminUser, action, targetType, targetId, previousStatus = null, newStatus = null, note = '' }) {
    const logs = this.loadLogs();
    const newEntry = {
      id: `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      adminUserId: adminUser?.id || 'SYSTEM',
      adminName: adminUser?.name || 'System Admin',
      adminEmail: adminUser?.email || 'admin@impactbridge.org',
      action: String(action).toUpperCase(),
      targetType: String(targetType).toUpperCase(),
      targetId: String(targetId || ''),
      previousStatus: previousStatus || null,
      newStatus: newStatus || null,
      note: String(note || '').trim(),
      timestamp: new Date().toISOString()
    };

    logs.unshift(newEntry);
    this.saveLogs(logs);
    return newEntry;
  }

  findAll(filters = {}) {
    let logs = this.loadLogs();
    const { action, targetType, search, limit = 50, page = 1 } = filters;

    if (action && action !== 'ALL') {
      logs = logs.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }

    if (targetType && targetType !== 'ALL') {
      logs = logs.filter((l) => l.targetType.toLowerCase() === targetType.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.targetType.toLowerCase().includes(q) ||
          l.targetId.toLowerCase().includes(q) ||
          l.adminName.toLowerCase().includes(q) ||
          l.adminEmail.toLowerCase().includes(q) ||
          (l.note && l.note.toLowerCase().includes(q))
      );
    }

    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const paginated = logs.slice(startIndex, startIndex + Number(limit));

    return {
      logs: paginated,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };
  }
}

module.exports = new AuditLogModel();
