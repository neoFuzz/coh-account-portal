const express = require('express');
const router = express.Router();
const GameAccountController = require('../App/Controllers/gameAccountController');

const gameAccountController = new GameAccountController();

router.get('/login', gameAccountController.login);
router.post('/login', gameAccountController.login);
router.get('/logout', gameAccountController.logout);
router.post('/create', gameAccountController.create);
router.post('/changepassword', gameAccountController.changePassword);

module.exports = router;