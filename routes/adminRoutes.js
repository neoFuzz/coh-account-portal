const express = require('express');
const router = express.Router();
const AdminController = require('../App/controllers/adminController.js');

// Define routes
router.get('/admin', AdminController.adminPage);
router.get('/admin/:uid', AdminController.adminAccount);

router.get('/list/account', AdminController.listAccount);
router.get('/admin/list/character/:uid', AdminController.listCharacter);

router.get('/admin/list/account', AdminController.listAccount);
router.get('/admin-account/:uid', AdminController.adminAccount);
router.get('/list-character/:uid', AdminController.listCharacter);

module.exports = router;
