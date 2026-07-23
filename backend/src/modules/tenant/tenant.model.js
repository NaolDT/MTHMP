const { Schema, model } = require('mongoose');

const TenantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    isActive: { type: Boolean, default: true },
    settings: {
      branding: {
        logo: { type: String, default: '' },
        primaryColor: { type: String, default: '#2563eb' },
        secondaryColor: { type: String, default: '#1e293b' },
      },
      features: {
        allowOnlineBooking: { type: Boolean, default: true },
        requireApproval: { type: Boolean, default: false },
        maxAppointmentsPerDay: { type: Number, default: null },
      },
      notifications: {
        emailEnabled: { type: Boolean, default: true },
        smsEnabled: { type: Boolean, default: false },
      },
      
      timezone: { type: String, default: 'UTC' },
    },
    subscription: {
      startDate: { type: Date },
      endDate: { type: Date },
      status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    },
  },
  { timestamps: true }
);

TenantSchema.index({ name: 1 });

module.exports = model('Tenant', TenantSchema);