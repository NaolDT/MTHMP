const { Router } = require('express');

const controller = require('./department.controller');
const validation = require('./department.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.use(authenticate);

router.get('/', list_guard, controller.list);
router.get('/:id', controller.getOne);

router.post('/', authorize('admin'), validate(validation.createDepartment), controller.create);
router.patch('/:id', authorize('admin'), validate(validation.updateDepartment), controller.update);
router.patch('/:id/status', authorize('admin'), validate(validation.setActive), controller.setActive);

function list_guard(req, res, next) {
  if (!req.tenantId) {
    return res.status(403).json({ success: false, message: 'Not applicable to super-admin' });
  }
  next();
}

module.exports = router;