const express = require('express');

const viewsController = require('../controllers/viewsController');

const router = new express.Router();

router.get('/', viewsController.getOverview);
router.get('/topic', viewsController.getTopic);

module.exports = router;
