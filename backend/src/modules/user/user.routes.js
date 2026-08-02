const { Router } = require('express');

const controller = require('./user.controller');
const validation = require('./user.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.use(authenticate, authorize('admin'));

router.post('/', validate(validation.createStaff), controller.createStaff);
router.get('/', controller.listStaff);

module.exports = router;