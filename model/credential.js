const mongoose = require('mongoose');

const credSchema = new mongoose.Schema({
   
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
     // Ensure uniqueness

    createdAt: { type: Date, default: Date.now },
});

const Cred = mongoose.model('creds', credSchema);

module.exports = Cred;
