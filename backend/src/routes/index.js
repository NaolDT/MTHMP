const { Router } = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const tenantRoutes = require('../modules/tenant/tenant.routes');
const departmentRoutes = require('../modules/department/department.routes');
const doctorRoutes = require('../modules/doctor/doctor.routes');
const patientRoutes = require('../modules/patient/patient.routes');
const appointmentRoutes = require('../modules/appointment/appointment.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const staffRoutes = require('../modules/user/user.routes');
const router = Router();
const contentRoutes = require('../modules/content/content.routes');
const contactRoutes = require('../modules/contact/contact.routes');
const hospitalProfileRoutes = require('../modules/hospitalProfile/hospitalProfile.routes');
const uploadRoutes = require('../modules/upload/upload.routes');

router.get('/health', (req, res) => res.status(200).json({ success: true, status: 'ok', time: new Date().toISOString() }));

router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);
router.use('/departments', departmentRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/staff', staffRoutes);
router.use('/content', contentRoutes);
router.use('/contact', contactRoutes);
router.use('/hospital-profile', hospitalProfileRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;