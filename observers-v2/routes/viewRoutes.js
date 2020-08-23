const express = require('express');

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = new express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/topics/:slug', viewsController.getTopic);
router.get('/about', viewsController.about);
router.get('/login', viewsController.login);
router.get('/signup', viewsController.signup);
router.get('/me', authController.protect, viewsController.getMe);
router.get('/users/forgotpassword', viewsController.forgotPassword);
router.get(
  '/users/resetPassword/:resetToken',
  viewsController.resetUserPassword
);

module.exports = router;
