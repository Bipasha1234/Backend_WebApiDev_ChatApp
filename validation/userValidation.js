
const joi=require("joi")

const emailScheme=joi.object({
    email:joi.string().required().email(),
})

const otpSchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
});

function validateEmail(req, res, next) {
    const { error } = emailScheme.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    next();
}

function validateOtp(req, res, next) {
    const { error } = otpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    next();
}

module.exports = { validateEmail, validateOtp };
