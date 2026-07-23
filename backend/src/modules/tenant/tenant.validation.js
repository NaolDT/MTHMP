const Joi = require('joi');

const createTenant = Joi.object({
  name: Joi.string().min(2).required(),
  timezone: Joi.string().default('UTC'),
  adminEmail: Joi.string().email().required(),
  adminPassword: Joi.string().min(8).required(),
  adminFirstName: Joi.string().required(),
  adminLastName: Joi.string().required(),
});

const setActive = Joi.object({
  isActive: Joi.boolean().required(),
});

module.exports = { createTenant, setActive };