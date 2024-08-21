const express = require('express');
const router = express.Router();
const FederationController = require('../App/Controllers/federationContoller');

// Create an instance of FederationController
const federationController = new FederationController();

router.get('/federate/login', federationController.login);
router.get('/review-policy', federationController.reviewPolicy);
router.post('/pull-character', federationController.pullCharacter);
router.post('/transfer-character-request', federationController.transferCharacterRequest);
router.post('/clear-transfer', federationController.clearTransfer);

module.exports = router;
