const express = require('express');
const router = express.Router();
const StaticController = require('../App/controllers/StaticController.js');

const staticController = new StaticController();

router.get('/', staticController.home);
router.get('/:page.phtml', staticController.page);

router.get('/create', staticController.create);
router.get('/manage', staticController.manage);
router.get('/:page', staticController.page);

module.exports = router;