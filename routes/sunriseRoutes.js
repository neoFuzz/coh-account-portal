const express = require('express');
const router = express.Router();
const SunriseController = require('../App/Controllers/sunriseController');

const sunriseController = new SunriseController();

router.get('/manifest.xml', sunriseController.manifest.bind(sunriseController));
router.get('/uptime.xml', sunriseController.uptime.bind(sunriseController));

router.get('/manifest', sunriseController.manifest.bind(sunriseController));
router.get('/uptime', sunriseController.uptime.bind(sunriseController));

module.exports = router;
