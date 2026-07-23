const { Router } = require('express');

const controller = require('./patient.controller');
const validation = require('./patient.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'receptionist', 'doctor'), controller.list);
router.get('/:id', authorize('admin', 'receptionist', 'doctor', 'patient'), controller.getOne);
router.patch('/:id', authorize('admin', 'receptionist', 'patient'), validate(validation.updatePatient), controller.update);

router.post('/', authorize('admin', 'receptionist'), validate(validation.registerPatient), controller.register);

module.exports = router;