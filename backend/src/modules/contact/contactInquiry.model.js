const { Schema, model } = require('mongoose');

const ContactInquirySchema = new Schema(
  {
    hospitalName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

ContactInquirySchema.index({ status: 1, createdAt: -1 });

module.exports = model('ContactInquiry', ContactInquirySchema);