const { Router } = require('express');

const controller = require('./tenant.controller');
const validation = require('./tenant.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.use(authenticate, authorize('super-admin'));

router.post('/', validate(validation.createTenant), controller.create);
router.get('/', controller.list);
router.patch('/:id/status', validate(validation.setActive), controller.setActive);

module.exports = router;