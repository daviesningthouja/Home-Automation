const express = require('express');
const router = express.Router();
const relayController = require('../controller/relayController');

// Route to get all relays
router.get('/', relayController.getRelays);

// Route to update relay states
router.put('/updates', relayController.updateRelays);

router.post('/temperature', relayController.postTemp );

router.get('/temperature' ,relayController.getTemp)

module.exports = router;
