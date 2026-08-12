const { Router } = require('express');
const controller = require('./content.controller');

const router = Router();

router.get('/health', controller.getHealthContent);

module.exports = router;