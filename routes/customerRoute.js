const express = require("express");
const { validateEmail, validateOtp } = require("../validation/CustomerValidation"); // Correctly destructuring imports
const {
    findAll,
    save,
    verifyOtp,
    resendOtp,
    findById,
    deleteById,
    update,
} = require("../controller/customerController");

const router = express.Router();

router.get("/", findAll);
router.post("/", validateEmail, save);
router.post("/verify-otp", validateOtp, verifyOtp);
router.post("/resend-otp",resendOtp);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", update);

module.exports = router;
