const { Router } = require('express');

const controller = require('./analytics.controller');
const validation = require('./analytics.validation');
const validate = require('../../shared/middlewares/validate');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.use(authenticate);

router.get('/overview', authorize('admin'), controller.overview);
router.get('/trend', authorize('admin'), validate(validation.trendQuery), (req, res, next) => {
  req.body = req.query;
  next();
}, controller.trend);
router.get(
  '/utilization',
  authorize('admin'),
  (req, res, next) => {
    req.body = req.query;
    next();
  },
  validate(validation.utilizationQuery),
  controller.utilization
);

router.get('/platform-overview', authorize('super-admin'), controller.platformOverview);

module.exports = router;