const express=require("express");
const router=express.Router();


const { login,register,logout,checkAuth } = require("../controller/AuthController");
const  protectRoute  = require("../security/Auth");


router.post("/login", login)
router.post("/register",register)
router.post("/logout",logout)

router.get("/check",protectRoute,checkAuth)
module.exports=router;