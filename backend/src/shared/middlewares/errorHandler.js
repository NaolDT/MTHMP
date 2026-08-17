const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
function errorHandler(err, req, res, next) {
  let { statusCode, message } = err;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for "${err.path}"`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `A record with this ${field} already exists` : 'Duplicate record';
  }
   else if (err.code === 'LIMIT_FILE_SIZE') {
  statusCode = 400;
  message = 'File is too large — maximum size is 5MB';
}

  if (!statusCode) statusCode = 500;
  if (!message) message = 'Internal server error';

  if (statusCode >= 500 || !(err instanceof ApiError)) {
    logger.error(err.message, { stack: err.stack, path: req.originalUrl, method: req.method });
  } else {
    logger.warn(err.message, { path: req.originalUrl, method: req.method });
  }

  res.status(statusCode).json({
  success: false,
  message,
  ...(err.details ? { details: err.details } : {}),
  ...(process.env.NODE_ENV !== 'production' && statusCode >= 500 ? { stack: err.stack } : {}),
});
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };