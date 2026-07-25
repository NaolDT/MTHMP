const Joi = require('joi');

const trendQuery = Joi.object({
  days: Joi.number().integer().min(1).max(90).default(7),
});

const utilizationQuery = Joi.object({
  dateFrom: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  dateTo: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});

module.exports = { trendQuery, utilizationQuery };