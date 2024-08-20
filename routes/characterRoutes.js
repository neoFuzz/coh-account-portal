const express = require('express');
const router = express.Router();
const CharacterController = require('../App/Controllers/characterController');

router.get('/dev', CharacterController.dev);

module.exports = router;
