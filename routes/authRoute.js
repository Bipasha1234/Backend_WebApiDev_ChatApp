const express=require("express");
const router=express.Router();


const { login,register,logout,checkAuth,updateProfile } = require("../controller/AuthController");
const  protectRoute  = require("../security/Auth");


router.post("/login", login)
router.post("/register",register)
router.post("/logout",logout)

router.get("/check",protectRoute,checkAuth)

router.put("/update-profile", protectRoute, updateProfile);
module.exports=router;