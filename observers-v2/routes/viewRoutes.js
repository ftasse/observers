const express = require('express');

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = new express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/topics/:slug', viewsController.getTopic);
router.get('/login', viewsController.login);
router.get('/signup', viewsController.signup);
router.get('/me', viewsController.getMe);

module.exports = router;
