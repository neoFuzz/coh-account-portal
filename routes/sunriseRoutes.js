const express = require('express');
const router = express.Router();
const SunriseController = require('../App/Controllers/sunriseController');

const sunriseController = new SunriseController();

router.get('/manifest.xml', sunriseController.manifest);
router.get('/uptime.xml', sunriseController.uptime);

router.get('/manifest', sunriseController.manifest);
router.get('/uptime', sunriseController.uptime);

module.exports = router;
