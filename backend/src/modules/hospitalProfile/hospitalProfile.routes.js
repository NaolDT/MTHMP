const { Router } = require('express');

const controller = require('./hospitalProfile.controller');
const validation = require('./hospitalProfile.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', controller.getMyProfile);
router.patch('/', validate(validation.updateProfile), controller.updateMyProfile);
router.post('/submit', controller.submitForReview);

module.exports = router;