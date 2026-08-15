const { Router } = require('express');
const rateLimit = require('express-rate-limit');

const controller = require('./auth.controller');
const validation = require('./auth.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

router.post('/login', authLimiter, validate(validation.login), controller.login);
router.post('/refresh', authLimiter, validate(validation.refresh), controller.refresh);
router.post('/register/patient', authLimiter, validate(validation.registerPatient), controller.registerPatient);

router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);
router.post('/forgot-password', authLimiter, validate(validation.forgotPassword), controller.forgotPassword);
router.post('/reset-password', authLimiter, validate(validation.resetPassword), controller.resetPassword);

module.exports = router;