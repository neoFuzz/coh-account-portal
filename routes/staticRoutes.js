const express = require('express');
const router = express.Router();
const StaticController = require('../App/controllers/StaticController.js');

const staticController = new StaticController();

router.get('/', staticController.home);
router.get('/create', staticController.create);
router.get('/manage', staticController.manage);

// for serving static pages
router.get('/web/:page.phtml', staticController.page);
router.get('/web/:page', staticController.page);

module.exports = router;