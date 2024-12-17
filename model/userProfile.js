const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to Customer model
        required: true, // Make this field required to associate the profile with a customer
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
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;
