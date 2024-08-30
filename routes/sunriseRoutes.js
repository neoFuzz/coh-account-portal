const express = require('express');
const router = express.Router();
const SunriseController = require('../App/Controllers/sunriseController');

// Create a new instance of SunriseController
const sunriseController = new SunriseController();

// Set up the routes
router.get('/manifest.xml', sunriseController.manifest.bind(sunriseController));
router.get('/uptime.xml', sunriseController.uptime.bind(sunriseController));

router.get('/manifest', sunriseController.manifest.bind(sunriseController));
router.get('/uptime', sunriseController.uptime.bind(sunriseController));

module.exports = router;
