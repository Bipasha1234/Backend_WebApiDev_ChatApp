const express = require("express");
const { validateEmail, validateOtp } = require("../validation/userValidation"); // Correctly destructuring imports

const {
    findAll,
    save,
    verifyOtp,
    resendOtp,
    findById,
    deleteById,
    update,
} = require("../controller/userController");

const router = express.Router();

router.get("/", findAll);
router.post("/", validateEmail, save);
router.post("/verify-otp", validateOtp, verifyOtp);
router.post("/resend-otp",resendOtp);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", update);

module.exports = router;
