const express = require('express');
const router = express.Router();
const GameAccountController = require('../App/Controllers/gameAccountController');

// Create a GameAccountController object.
const gameAccountController = new GameAccountController();

// Set up routes and bind the object.
router.get('/login', gameAccountController.login.bind(gameAccountController));
router.post('/login', gameAccountController.login.bind(gameAccountController));
router.get('/logout', gameAccountController.logout.bind(gameAccountController));
router.post('/create', gameAccountController.create.bind(gameAccountController));
router.post('/changepassword', gameAccountController.changePassword.bind(gameAccountController));

module.exports = router;