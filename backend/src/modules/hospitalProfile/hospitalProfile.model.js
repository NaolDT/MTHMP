const { Schema, model } = require('mongoose');
const tenantPlugin = require('../../shared/plugins/tenantPlugin');

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const WorkingHourSchema = new Schema(
  {
    day: { type: String, enum: DAYS, required: true },
    openTime: { type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/, default: '09:00' },
    closeTime: { type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/, default: '17:00' },
    isOpen: { type: Boolean, default: true },
  },
  { _id: false }
);

const GalleryImageSchema = new Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const HospitalProfileSchema = new Schema(
  {
    tagline: { type: String, default: '', maxlength: 120 },
    shortDescription: { type: String, default: '', maxlength: 300 },
    fullDescription: { type: String, default: '' },
    foundingYear: { type: Number, default: null },
    history: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    values: { type: [String], default: [] },
    facilities: { type: [String], default: [] },
    workingHours: { type: [WorkingHourSchema], default: [] },
    contactAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      region: { type: String, default: '' },
      country: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      emergencyPhone: { type: String, default: '' },
    },
    gallery: { type: [GalleryImageSchema], default: [] },
    logoUrl: { type: String, default: '' },
    coverImageUrl: { type: String, default: '' },

    status: { type: String, enum: ['draft', 'pending', 'published'], default: 'draft' },
    submittedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);


HospitalProfileSchema.plugin(tenantPlugin, { indexed: false });
HospitalProfileSchema.index({ tenantId: 1 }, { unique: true });
HospitalProfileSchema.index({ status: 1 });

module.exports = model('HospitalProfile', HospitalProfileSchema);