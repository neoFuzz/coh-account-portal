const express = require('express');
const router = express.Router();
const ReportsController = require('../App/controllers/ReportsController');

const reportsController = new ReportsController();

router.get('/reports', reportsController.listReports);
router.get('/reports/:name', reportsController.report);

module.exports = router;
