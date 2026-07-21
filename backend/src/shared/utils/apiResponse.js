function success(res, statusCode, data, meta) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

function error(res, statusCode, message, details) {
  const body = { success: false, message };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
}

module.exports = { success, error };