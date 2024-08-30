const express = require('express');
const router = express.Router();
const CharacterController = require('../App/Controllers/characterController');

// This is a route for developing code Character related data
router.get('/dev', CharacterController.dev);

module.exports = router;
