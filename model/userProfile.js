const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
    image:{
        type:String,
        required:false
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true,match: [/^\d{10}$/, 'Phone number must be 10 digits'] },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
