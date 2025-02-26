const express=require("express");
const router=express.Router();
const upload = require("../middleware/uploads");


const { login,register,logout,checkAuth,updateProfile,uploadImage,getCurrentUser, forgotPassword, resetPassword, verifyResetCode, updateProfileApp } = require("../controller/AuthController");
const  protectRoute  = require("../security/Auth");


router.post("/login", login)
router.post("/register",register)
router.post("/logout",logout)
router.get("/check",protectRoute,checkAuth)
router.put("/update-profile", protectRoute,updateProfile);
router.put("/update-profile-app", protectRoute,upload,updateProfileApp);
router.post("/uploadImage", upload, uploadImage);
router.get("/get-user",protectRoute,getCurrentUser);
router.post("/forgot-password",forgotPassword);
router.post("/verify-reset-code",verifyResetCode);
router.post("/reset-password",resetPassword);
module.exports=router;