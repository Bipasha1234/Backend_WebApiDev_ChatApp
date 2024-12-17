const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    userProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile', // Reference to the UserProfile model
    },
});

const Customer = mongoose.model("Users", customerSchema);
module.exports = Customer;
