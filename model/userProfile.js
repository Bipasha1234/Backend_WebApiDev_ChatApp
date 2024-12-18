const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to Customer model
    },
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\d{10}$/, 'Phone number must be 10 digits']
    },
    gender: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    otp: {
        type: String, // OTP for email re-verification
        required: false
    },
    otpExpiresAt: {
        type: Date, // Expiration time for OTP
        required: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;
