const express = require('express');

const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');
const voteRouter = require('./voteRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:reportId/votes', voteRouter);

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
  .route('/whatsapp')
  .post(
    reportController.setTopicId,
    reportController.setReportFromWhatsApp,
    reportController.createReport,
    reportController.replyToWhatsAppReport
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
