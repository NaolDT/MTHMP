const Joi = require('joi');

const registerPatient = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  dateOfBirth: Joi.date().less('now').required(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say'),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zipCode: Joi.string().allow(''),
    country: Joi.string().allow(''),
  }),
  emergencyContact: Joi.object({
    name: Joi.string().allow(''),
    relationship: Joi.string().allow(''),
    phone: Joi.string().allow(''),
  }),
});

const updatePatient = Joi.object({
  phone: Joi.string(),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zipCode: Joi.string().allow(''),
    country: Joi.string().allow(''),
  }),
  emergencyContact: Joi.object({
    name: Joi.string().allow(''),
    relationship: Joi.string().allow(''),
    phone: Joi.string().allow(''),
  }),
}).min(1);

module.exports = { registerPatient, updatePatient };