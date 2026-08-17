const { Router } = require('express');

const controller = require('./upload.controller');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');
const upload = require('../../shared/middlewares/upload');

const router = Router();

router.post('/image', authenticate, upload.single('image'), authorize('admin', 'doctor'), controller.uploadImage);
module.exports = router;