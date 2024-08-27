const express = require('express');
const router = express.Router();
const AdminController = require('../App/controllers/adminController.js');
const ReportsController = require('../App/Controllers/reportsController');

// Set up the reports controller and define it's routes.
const reportsController = new ReportsController();

router.get('/admin/reports', reportsController.listReports.bind(reportsController));
router.get('/admin/reports/:name', reportsController.report.bind(reportsController));

// Define routes for the Admin pages.
router.get('/admin', AdminController.adminPage);
router.get('/admin/:uid', AdminController.adminAccount);
router.get('/admin/list/character/:uid', AdminController.listCharacter);
router.get('/admin/list/account', AdminController.listAccount);
router.post('/admin/:uid/ban', AdminController.banAccount);


module.exports = router;
