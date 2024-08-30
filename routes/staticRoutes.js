const express = require('express');
const router = express.Router();
const StaticController = require('../App/controllers/StaticController.js');

// Set up a new StaticController
const staticController = new StaticController();

// The basic pages
router.get('/', staticController.home);
router.get('/create', staticController.create);
router.get('/manage', staticController.manage);

// for serving other static content and pages
router.get('/web/:page.phtml', staticController.page);
router.get('/web/:page', staticController.page);

module.exports = router;