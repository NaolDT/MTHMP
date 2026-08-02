const Joi = require('joi');

const createStaff = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().allow(''),
  role: Joi.string().valid('receptionist').required(), 
});

module.exports = { createStaff };