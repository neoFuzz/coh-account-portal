const express = require('express');
const router = express.Router();
const FederationController = require('../App/Controllers/federationContoller');

// Create an instance of FederationController
const federationController = new FederationController();

router.get('/federation/login', federationController.login);
router.get('/federation/review-policy', federationController.reviewPolicy);
router.post('/federation/pull-character', federationController.pullCharacter);
router.post('/federation/transfer-character-request', federationController.transferCharacterRequest);
router.post('/federation/clear-transfer', federationController.clearTransfer);

module.exports = router;
