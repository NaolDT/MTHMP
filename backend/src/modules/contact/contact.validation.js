const Joi = require('joi');

const submitInquiry = Joi.object({
  hospitalName: Joi.string().min(2).required(),
  contactName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(''),
  message: Joi.string().allow('').max(2000),
});

const updateStatus = Joi.object({
  status: Joi.string().valid('new', 'contacted', 'closed').required(),
});

module.exports = { submitInquiry, updateStatus };