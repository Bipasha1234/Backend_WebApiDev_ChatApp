const Joi = require('joi');

// Define the user schema
const userSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required().pattern(/^\d{10}$/),  // Validate phone number (10 digits)
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    email: Joi.string().email().required(),
});

// Middleware to validate user input
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateUser; 