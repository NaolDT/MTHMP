const Joi = require('joi');

const passwordRule = Joi.string()
  .min(8)
  .pattern(/[A-Z]/, 'uppercase letter')
  .pattern(/[a-z]/, 'lowercase letter')
  .pattern(/[0-9]/, 'number')
  .required();

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  // Required for every role except super-admin, who logs in without one.
  tenantSlug: Joi.string().optional(),
});

const refresh = Joi.object({
  refreshToken: Joi.string().required(),
});

const registerStaff = Joi.object({
  email: Joi.string().email().required(),
  password: passwordRule,
  role: Joi.string().valid('admin', 'doctor', 'receptionist').required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().allow(''),
});

const registerPatient = Joi.object({
  email: Joi.string().email().required(),
  password: passwordRule,
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  dateOfBirth: Joi.date().less('now').required(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say'),
  tenantSlug: Joi.string().required(),
});

module.exports = { login, refresh, registerStaff, registerPatient };