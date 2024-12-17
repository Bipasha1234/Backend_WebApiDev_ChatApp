const mongoose = require('mongoose');
const pinSecuritySchema = new mongoose.Schema({
    userProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile', // Reference to the UserProfile model
    required: true,
    },
    pin: {
    type: String,
    required: true,
      },
    }, { timestamps: true });
module.exports = mongoose.model('PinSecurity', pinSecuritySchema);





