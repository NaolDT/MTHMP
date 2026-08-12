const ContactInquiry = require('./contactInquiry.model');
const ApiError = require('../../shared/utils/ApiError');
const logger = require('../../shared/utils/logger');

async function submitInquiry(input) {
  const inquiry = await ContactInquiry.create(input);
  logger.info('New hospital contact inquiry received', { hospitalName: input.hospitalName, email: input.email });
  return inquiry;
}

async function listInquiries({ status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  return ContactInquiry.find(filter).sort({ createdAt: -1 });
}

async function updateInquiryStatus(id, status) {
  const inquiry = await ContactInquiry.findByIdAndUpdate(id, { status }, { new: true });
  if (!inquiry) throw ApiError.notFound('Inquiry not found');
  return inquiry;
}

module.exports = { submitInquiry, listInquiries, updateInquiryStatus };