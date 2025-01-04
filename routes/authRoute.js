const express=require("express");
const router=express.Router();


const { login,register, checkAuth,logout } = require("../controller/AuthController");
const  protectRoute  = require("../security/Auth");


router.post("/login", login)
router.post("/register",register)
router.get("/check",protectRoute,checkAuth)
router.post("/logout",logout)
module.exports=router;