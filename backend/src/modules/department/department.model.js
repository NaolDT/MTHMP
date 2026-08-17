const { Schema, model } = require('mongoose');
const tenantPlugin = require('../../shared/plugins/tenantPlugin');

const ServiceItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const DepartmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    headDoctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', default: null },
    isActive: { type: Boolean, default: true },
    services: { type: [ServiceItemSchema], default: [] },
  },
  { timestamps: true }
);

DepartmentSchema.plugin(tenantPlugin);
DepartmentSchema.index({ tenantId: 1, name: 1 }, { unique: true });
DepartmentSchema.index({ tenantId: 1, isActive: 1 });

module.exports = model('Department', DepartmentSchema);