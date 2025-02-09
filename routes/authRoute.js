const express=require("express");
const router=express.Router();
const upload = require("../middleware/uploads");


const { login,register,logout,checkAuth,updateProfile,uploadImage,getCurrentUser } = require("../controller/AuthController");
const  protectRoute  = require("../security/Auth");


router.post("/login", login)
router.post("/register",register)
router.post("/logout",logout)

router.get("/check",protectRoute,checkAuth)

router.put("/update-profile", updateProfile);
router.post("/uploadImage", upload, uploadImage);
router.get("/get-user",protectRoute,getCurrentUser);
module.exports=router;