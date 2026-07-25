const { Router } = require('express');

const controller = require('./appointment.controller');
const validation = require('./appointment.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.use(authenticate);

router.get('/slots', controller.getSlots);

router.get('/', controller.list);
router.get('/:id', controller.getOne);

router.post('/', authorize('patient', 'admin', 'receptionist'), validate(validation.bookAppointment), controller.book);
router.patch('/:id/cancel', authorize('patient', 'admin', 'receptionist'), validate(validation.cancelAppointment), controller.cancel);
router.patch('/:id/status', authorize('doctor', 'admin'), validate(validation.updateStatus), controller.updateStatus);

module.exports = router;