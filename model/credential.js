const mongoose = require('mongoose');

const credSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Ensure uniqueness
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure uniqueness
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

const Cred = mongoose.model('creds', credSchema);

module.exports = Cred;
