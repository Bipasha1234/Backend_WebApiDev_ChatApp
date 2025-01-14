const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
      members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'creds', // 'creds' references the User model
        },
      ],
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'creds',
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const Group = mongoose.model("Group", groupSchema);
  
  module.exports = Group;
  