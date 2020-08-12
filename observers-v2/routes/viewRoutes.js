const express = require('express');

const viewsController = require('../controllers/viewsController');

const router = new express.Router();

router.get('/', viewsController.getOverview);
router.get('/topics/:slug', viewsController.getTopic);
router.get('/login', viewsController.login);

module.exports = router;
