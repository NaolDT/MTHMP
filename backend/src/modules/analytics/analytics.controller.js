const analyticsService = require('./analytics.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const overview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTenantOverview(req.tenantId);
  success(res, 200, data);
});

const trend = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAppointmentsTrend(req.tenantId, req.query.days);
  success(res, 200, data);
});

const utilization = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDoctorUtilization(req.tenantId, req.query.dateFrom, req.query.dateTo);
  success(res, 200, data);
});

const platformOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPlatformOverview();
  success(res, 200, data);
});

module.exports = { overview, trend, utilization, platformOverview };