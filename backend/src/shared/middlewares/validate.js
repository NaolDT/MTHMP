const ApiError = require('../utils/ApiError');
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((d) => d.message);
      return next(ApiError.badRequest('Validation failed', details));
    }
    req.body = value;
    next();
  };
}

module.exports = validate;