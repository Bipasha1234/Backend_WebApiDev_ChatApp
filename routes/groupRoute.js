
 const express = require("express");
const protectRoute=require("../security/Auth");
        
const {
  CreateGroup, getGroups} = require("../controller/groupController");
          
        
const router = express.Router();
router.post('/create', protectRoute, CreateGroup);

router.get('/get', protectRoute, getGroups);
        
        
 module.exports= router;
        