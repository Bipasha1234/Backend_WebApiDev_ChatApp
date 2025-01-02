const Joi = require('joi');

// Combined user schema for both create and update profile
const userSchema = Joi.object({
    image: Joi.string().optional(),
    name: Joi.string().required(), 
    phoneNumber: Joi.string()
        .required()
        .pattern(/^\d{10}$/)
        .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits."
        }),
    aboutYou: Joi.string().optional(),
    
});

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateUser;
