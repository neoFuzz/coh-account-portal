const express = require('express');
const router = express.Router();
const APIController = require('../App/Controllers/apiController');

// Handle pre-flight requests for all routes
router.options('/*', (req, res) => res.sendStatus(200));

// Middleware to set CORS headers for all routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');  // Allow requests from any origin
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization'); // Allow specific headers in requests
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow specific HTTP methods
  next();
});

// Route to delete a character via POST request
router.post('/api/character/delete', APIController.deleteCharacter);
router.post('/api/delete-character', APIController.deleteCharacter);

// Route to get a raw character data via GET request
router.get('/api/character/raw', APIController.getCharacter);

// Route to get plain-text character data via GET request
router.get('/api/character', APIController.getCharacter);


module.exports = router;
