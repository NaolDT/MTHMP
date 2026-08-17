const { Router } = require('express');

const controller = require('./hospitalProfile.controller');
const validation = require('./hospitalProfile.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.get('/public/:slug', controller.getPublicProfile);

router.use(authenticate);

router.get('/', authorize('admin'), controller.getMyProfile);
router.patch('/', authorize('admin'), validate(validation.updateProfile), controller.updateMyProfile);
router.post('/submit', authorize('admin'), controller.submitForReview);

router.get('/pending', authorize('super-admin'), controller.listPending);
router.patch('/:id/approve', authorize('super-admin'), controller.approve);
router.patch('/:id/reject', authorize('super-admin'), validate(validation.rejectProfile), controller.reject);

module.exports = router;