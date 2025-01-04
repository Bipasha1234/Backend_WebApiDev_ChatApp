const express = require('express');
const router = express.Router();
const validateUser = require('../validation/userProfileValidation'); 
const { 
    createProfile, 
    updateProfile, 
    getProfile, 
    deleteProfile, 
    getAllProfiles ,initiateEmailUpdate
} = require('../controller/userProfileController');

const multer = require('multer');
const protectRoute=require("../security/Auth");

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

router.post('/create',upload.single('image'), validateUser, createProfile);
router.put('/profile/:id',protectRoute,upload.single('image'), validateUser, updateProfile);
router.get('/profile/:id', protectRoute,getProfile);
router.delete('/profile/:id', protectRoute,deleteProfile);
router.get('/profiles',getAllProfiles);
router.post('/profile/email-update', protectRoute,initiateEmailUpdate)

module.exports = router;
