const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'creds', 
    // },
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
});

const UserProfile = mongoose.model("userprofiles", userProfileSchema);
module.exports = UserProfile;
