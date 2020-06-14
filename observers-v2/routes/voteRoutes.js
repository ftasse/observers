const express = require('express');
const voteController = require('../controllers/voteController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(voteController.getAllVotes)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    voteController.createVote
  );

router
  .route('/:id')
  .get(voteController.getVote)
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    voteController.updateVote
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    voteController.deleteVote
  );

module.exports = router;
