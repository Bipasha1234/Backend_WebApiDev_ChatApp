const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    userProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user',  // Default to 'user' if not specified
    },
});

const Customer = mongoose.model("Users", customerSchema);
module.exports = Customer;
