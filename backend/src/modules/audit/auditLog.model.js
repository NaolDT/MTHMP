const { Schema, model } = require('mongoose');
const tenantPlugin = require('../../shared/plugins/tenantPlugin');

const AuditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'APPROVE', 'REJECT'],
      required: true,
    },
    resource: {
      type: String,
      enum: ['USER', 'TENANT', 'DEPARTMENT', 'DOCTOR', 'PATIENT', 'APPOINTMENT', 'AVAILABILITY'],
      required: true,
    },
    resourceId: { type: String, default: null },
    changes: { type: Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    details: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.plugin(tenantPlugin);
AuditLogSchema.index({ tenantId: 1, createdAt: -1 });
AuditLogSchema.index({ tenantId: 1, userId: 1 });
AuditLogSchema.index({ tenantId: 1, resource: 1, action: 1 });

AuditLogSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  next(new Error('AuditLog entries are immutable and cannot be updated'));
});
AuditLogSchema.pre(['findOneAndDelete', 'deleteOne', 'deleteMany'], function (next) {
  next(new Error('AuditLog entries are immutable and cannot be deleted'));
});

module.exports = model('AuditLog', AuditLogSchema);