const express = require('express');

const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get(
  '/reportsWithin/:distance/center/:latLng/unit/:unit',
  reportController.setTopicId,
  reportController.getReportsWithin
);

router
  .route('/')
  .get(reportController.setTopicId, reportController.getAllReport)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reportController.setUserId,
    reportController.setTopicId,
    reportController.createReport
  );

router
  .route('/:id')
  .get(reportController.getReport)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    reportController.updateReport
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    reportController.deleteReport
  );

module.exports = router;
