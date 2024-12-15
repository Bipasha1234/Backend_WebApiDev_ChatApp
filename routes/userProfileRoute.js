const express = require('express');
const validateUser = require('../validation/userProfileValidation'); // Import validation middleware
const { createProfile } = require('../controller/userProfileController'); // Import controller method

const router = express.Router();


// POST route to create a new user profile
router.post('/profile', validateUser, createProfile);

module.exports = router;
