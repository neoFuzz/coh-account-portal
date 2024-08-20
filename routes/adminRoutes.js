const express = require('express');
const router = express.Router();
const AdminController = require('../App/Controllers/adminController');

// Define routes
//router.get('/', AdminController.adminPage);
router.get('/list/account', AdminController.listAccount);
router.get('/list/character/:uid', AdminController.listCharacter);
router.get('/admin/:uid', AdminController.adminAccount);

// Other routes ChatGPT came up with
router.get('/admin', AdminController.adminPage);
router.get('/list-account', AdminController.listAccount);
router.get('/admin-account/:uid', AdminController.adminAccount);
router.get('/list-character/:uid', AdminController.listCharacter);

module.exports = router;
