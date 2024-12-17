const express = require('express');
const router = express.Router();
const validateUser = require('../validation/userProfileValidation'); 
const { createProfile } = require('../controller/userProfileController'); 


const multer=require("multer")

const storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'chat_app_images')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload=multer({storage})

router.post('/profile',upload.single('image'),validateUser,createProfile);
module.exports = router;
