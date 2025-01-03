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
const {authenticateToken}=require("../security/Auth");

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
router.put('/profile/:id',authenticateToken,upload.single('image'), validateUser, updateProfile);
router.get('/profile/:id', authenticateToken,getProfile);
router.delete('/profile/:id', authenticateToken,deleteProfile);
router.get('/profiles', authenticateToken,getAllProfiles);
router.post('/profile/email-update', authenticateToken,initiateEmailUpdate)

module.exports = router;
