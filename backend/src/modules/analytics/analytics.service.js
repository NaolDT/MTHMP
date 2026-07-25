const mongoose = require('mongoose');
const Appointment = require('../appointment/appointment.model');
const Doctor = require('../doctor/doctor.model');
const Patient = require('../patient/patient.model');
const Department = require('../department/department.model');
const User = require('../user/user.model');
const Tenant = require('../tenant/tenant.model');

const { ObjectId } = mongoose.Types;

async function getTenantOverview(tenantId) {
  const tid = new ObjectId(tenantId);
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());

  const [totalDoctors, totalPatients, totalDepartments, statusBreakdown, todayCount, weekCount] = await Promise.all([
    Doctor.countDocuments({ isActive: true }).setOptions({ tenantId }),
    Patient.countDocuments({ isActive: true }).setOptions({ tenantId }),
    Department.countDocuments({ isActive: true }).setOptions({ tenantId }),
    Appointment.aggregate([
      { $match: { tenantId: tid } }, // manual scoping — aggregate bypasses the tenant plugin
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Appointment.countDocuments({ date: startOfToday, status: 'booked' }).setOptions({ tenantId }),
    Appointment.aggregate([
      { $match: { tenantId: tid, date: { $gte: startOfWeek }, status: 'booked' } },
      { $count: 'count' },
    ]),
  ]);

  const byStatus = statusBreakdown.reduce((acc, row) => {
    acc[row._id] = row.count;
    return acc;
  }, {});

  return {
    totalDoctors,
    totalPatients,
    totalDepartments,
    appointmentsByStatus: {
      booked: byStatus.booked || 0,
      cancelled: byStatus.cancelled || 0,
      completed: byStatus.completed || 0,
      'no-show': byStatus['no-show'] || 0,
    },
    appointmentsToday: todayCount,
    appointmentsThisWeek: weekCount[0]?.count || 0,
  };
}

async function getAppointmentsTrend(tenantId, days) {
  const tid = new ObjectId(tenantId);
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));

  const results = await Appointment.aggregate([
    { $match: { tenantId: tid, date: { $gte: startDate } } },
    {
      $group: {
        _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, status: '$status' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
  ]);

  const byDate = {};
  for (const row of results) {
    const d = row._id.date;
    if (!byDate[d]) byDate[d] = { date: d, booked: 0, cancelled: 0, completed: 0, 'no-show': 0 };
    byDate[d][row._id.status] = row.count;
  }

  const trend = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    trend.push(byDate[key] || { date: key, booked: 0, cancelled: 0, completed: 0, 'no-show': 0 });
  }

  return trend;
}

/** Appointment counts per doctor within a date range — a proxy for utilization. */
async function getDoctorUtilization(tenantId, dateFrom, dateTo) {
  const tid = new ObjectId(tenantId);
  const start = new Date(`${dateFrom}T00:00:00Z`);
  const end = new Date(`${dateTo}T23:59:59Z`);

  const results = await Appointment.aggregate([
    { $match: { tenantId: tid, date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$doctorId',
        total: { $sum: 1 },
        booked: { $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        noShow: { $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] } },
      },
    },
    {
      $lookup: {
        from: 'doctors',
        localField: '_id',
        foreignField: '_id',
        as: 'doctor',
      },
    },
    { $unwind: '$doctor' },
    {
      $lookup: {
        from: 'users',
        localField: 'doctor.userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        doctorId: '$_id',
        doctorName: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
        specialization: '$doctor.specialization',
        totalAppointments: '$total',
        booked: 1,
        completed: 1,
        cancelled: 1,
        noShow: 1,
      },
    },
    { $sort: { totalAppointments: -1 } },
  ]);

  return results;
}

async function getPlatformOverview() {
  const [totalTenants, activeTenants, totalUsers, usersByRole] = await Promise.all([
    Tenant.countDocuments(),
    Tenant.countDocuments({ isActive: true }),
    User.countDocuments().setOptions({ skipTenantScope: true }),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);

  const byRole = usersByRole.reduce((acc, row) => {
    acc[row._id] = row.count;
    return acc;
  }, {});

  return {
    totalTenants,
    activeTenants,
    inactiveTenants: totalTenants - activeTenants,
    usersByRole: byRole,
  };
}

module.exports = { getTenantOverview, getAppointmentsTrend, getDoctorUtilization, getPlatformOverview };