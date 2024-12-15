const express = require('express');
const router = express.Router();
const validateUser = require('../validation/userProfileValidation'); // Import validation middleware
const { createProfile } = require('../controller/userProfileController'); // Import controller method


const multer=require("multer")

const storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'ground_images')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload=multer({storage})

router.post('/profile',upload.single('image'),validateUser,createProfile);
module.exports = router;
