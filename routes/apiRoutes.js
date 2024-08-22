const express = require('express');
const router = express.Router();
const APIController = require('../App/Controllers/apiController');

router.options('/*', (req, res) => res.sendStatus(200));

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

router.post('/api/character/delete', APIController.deleteCharacter);
router.get('/api/character/raw', APIController.getCharacter);

router.get('/api/character', APIController.getCharacter);
router.post('/api/delete-character', APIController.deleteCharacter);

module.exports = router;
