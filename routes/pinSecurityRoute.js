const express = require('express');
const { createPin, authenticatePin } = require('../controller/pinSecurityController');
const router = express.Router();
// Route to create or update the PIN
router.post('/pin/create', createPin);
// Route to authenticate the user with the PIN
router.post('/pin/authenticate', authenticatePin);
module.exports = router;




