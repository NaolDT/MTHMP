const { Router } = require('express');
const rateLimit = require('express-rate-limit');

const controller = require('./contact.controller');
const validation = require('./contact.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions — please try again later.' },
});

router.post('/', contactLimiter, validate(validation.submitInquiry), controller.submit);

router.use(authenticate, authorize('super-admin'));

router.get('/', controller.list);
router.patch('/:id/status', validate(validation.updateStatus), controller.updateStatus);

module.exports = router;