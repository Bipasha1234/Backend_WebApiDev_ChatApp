const Joi = require('joi');

// Combined user schema for both create and update profile
const userSchema = Joi.object({
    customerId: Joi.string().required(), // Always required
    image: Joi.string().optional(), // Optional field
    name: Joi.string().required(), // Required for both create and update
    phoneNumber: Joi.string()
        .required()
        .pattern(/^\d{10}$/)
        .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits."
        }),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    email: Joi.string().email().required(),
    otp: Joi.string()
        .length(6)
        .optional() 
        .messages({
            "string.length": "OTP must be exactly 6 digits."
        }),
    otpExpiresAt: Joi.date()
        .optional() // Optional field
        .messages({
            "date.base": "OTP expiration must be a valid date."
        }),
});

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateUser;
