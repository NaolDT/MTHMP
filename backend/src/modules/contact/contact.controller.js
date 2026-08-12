const contactService = require('./contact.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const submit = asyncHandler(async (req, res) => {
  await contactService.submitInquiry(req.body);
  success(res, 201, { message: 'Thank you — we\'ll be in touch soon.' });
});

const list = asyncHandler(async (req, res) => {
  const inquiries = await contactService.listInquiries(req.query);
  success(res, 200, inquiries);
});

const updateStatus = asyncHandler(async (req, res) => {
  const inquiry = await contactService.updateInquiryStatus(req.params.id, req.body.status);
  success(res, 200, inquiry);
});

module.exports = { submit, list, updateStatus };