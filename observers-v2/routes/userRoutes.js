const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:resetToken', authController.resetPassword);
router.post(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router
  .route('/')
  // .get(authController.restrictTo('admin'), userController.getAllUsers)
  .get(userController.getAllUsers)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser
  );
router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;
