const { Router } = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const tenantRoutes = require('../modules/tenant/tenant.routes');
const departmentRoutes = require('../modules/department/department.routes');
const router = Router();

router.get('/health', (req, res) => res.status(200).json({ success: true, status: 'ok', time: new Date().toISOString() }));

router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);
router.use('/departments', departmentRoutes);

module.exports = router;