const { Router } = require('express');

const controller = require('./doctor.controller');
const validation = require('./doctor.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.use(authenticate);

router.get('/me', authorize('doctor'), controller.getMyProfile);
router.patch('/me', authorize('doctor'), validate(validation.updateMyProfile), controller.updateMyProfile);

router.get('/', controller.list);
router.get('/:id', controller.getOne);

router.post('/', authorize('admin'), validate(validation.createDoctor), controller.create);
router.patch('/:id', authorize('admin'), validate(validation.updateDoctor), controller.update);
router.patch('/:id/status', authorize('admin'), validate(validation.setActive), controller.setActive);

router.put(
  '/:id/availability',
  authorize('admin', 'doctor'),
  validate(validation.setAvailability),
  controller.setAvailability
);

module.exports = router;