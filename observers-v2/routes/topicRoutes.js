const express = require('express');
const topicController = require('../controllers/topicController');
const authController = require('../controllers/authController');

const reportRouter = require('../routes/reportRoutes');

const router = express.Router();

router.use('/:topicId/reports', reportRouter);

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
    topicController.getTopicTags,
    topicController.createTopic
  );

router
  .route('/:id')
  .get(topicController.getTopic)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    topicController.getTopicTags,
    topicController.updateTopic
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    topicController.deleteTopic
  );

module.exports = router;
