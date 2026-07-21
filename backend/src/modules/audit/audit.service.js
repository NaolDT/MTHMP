const AuditLog = require('./auditLog.model');
const logger = require('../../shared/utils/logger');

async function record({ tenantId, userId, action, resource, resourceId, changes, req, details }) {
  try {
    await AuditLog.create({
      tenantId,
      userId,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : null,
      changes: changes || null,
      details: details || null,
      ipAddress: req ? req.ip : '',
      userAgent: req ? req.headers['user-agent'] : '',
    });
  } catch (err) {
    logger.error('Failed to write audit log', { error: err.message, action, resource });
  }
}

module.exports = { record };