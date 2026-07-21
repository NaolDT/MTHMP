const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw ApiError.unauthorized('Missing or malformed Authorization header');
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtConfig.accessSecret);
  } catch (err) {
    throw ApiError.unauthorized(
      err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token'
    );
  }

  req.user = {
    id: payload.sub,
    tenantId: payload.tenantId || null,
    role: payload.role,
  };
  req.tenantId = payload.tenantId || null;

  next();
});

module.exports = authenticate;