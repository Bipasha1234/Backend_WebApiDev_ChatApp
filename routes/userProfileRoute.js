const express = require('express');
const router = express.Router();
const validateUser = require('../validation/userProfileValidation'); 
const { 
    createProfile, 
    updateProfile, 
    getProfile, 
    deleteProfile, 
    getAllProfiles 
} = require('../controller/userProfileController');

const multer = require('multer');

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'chat_app_images'); // Store uploaded images in this folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep original file name
    }
});

const upload = multer({ storage });

router.post('/profile', upload.single('image'), validateUser, createProfile);
router.put('/profile/:id', upload.single('image'), validateUser, updateProfile);
router.get('/profile/:id', getProfile);
router.delete('/profile/:id', deleteProfile);
router.get('/profiles', getAllProfiles);

module.exports = router;
