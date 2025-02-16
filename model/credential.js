const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    blockedUsers: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "creds" 
      }
    ],
    resetCode: {
      type: String,  // The hashed reset code
      default: null,
    },
    resetCodeExpires: {
      type: Date,  // The expiration time of the reset code
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("creds", userSchema);

module.exports = User;
