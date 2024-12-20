const Joi = require('joi');

// Combined user schema for both create and update profile
const userSchema = Joi.object({
    userId: Joi.string().required(), 
    image: Joi.string().optional(),
    name: Joi.string().required(), 
    phoneNumber: Joi.string()
        .required()
        .pattern(/^\d{10}$/)
        .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits."
        }),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    email: Joi.string().email().optional(),
    
});

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateUser;
