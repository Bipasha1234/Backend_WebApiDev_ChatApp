const mongoose = require('mongoose');

const credSchema = new mongoose.Schema({
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure uniqueness

    createdAt: { type: Date, default: Date.now },
});

const Cred = mongoose.model('creds', credSchema);

module.exports = Cred;
