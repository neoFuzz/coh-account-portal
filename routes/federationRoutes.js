const express = require('express');
const router = express.Router();
const FederationController = require('../App/Controllers/federationContoller');

// Create an instance of FederationController
const federationController = new FederationController();

// Add the GET routes
router.get('/federation/login', federationController.login);
router.get('/federation/review-policy', federationController.reviewPolicy);

// Add the POST routes
router.post('/federation/pull-character', federationController.pullCharacter);
router.post('/federation/transfer-character-request', federationController.transferCharacterRequest);
router.post('/federation/clear-transfer', federationController.clearTransfer);

module.exports = router;
