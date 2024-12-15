const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
