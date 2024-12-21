const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    userProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfile' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Default role
});

const Customer = mongoose.model("users", customerSchema);

module.exports = Customer;
