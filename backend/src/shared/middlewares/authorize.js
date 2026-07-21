const ApiError = require('../utils/ApiError');
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Role "${req.user.role}" is not permitted to perform this action`));
    }
    next();
  };
}

module.exports = authorize;