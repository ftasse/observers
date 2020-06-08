const express = require('express');
const topicController = require('../controllers/topicController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/topicsWithin/:distance/center/:latLng/unit/:unit',
  topicController.getTopicsWithin
);

router
  .route('/')
  .get(topicController.getAllTopics)
  .post(
    authController.protect,
    authController.restrictTo('user', 'moderator'),
    topicController.createTopic
  );

router
  .route('/:id')
  .get(topicController.getTopic)
  .patch(topicController.updateTopic)
  .delete(topicController.deleteOne);

module.exports = router;
