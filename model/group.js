const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String, 
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "creds",
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creds",
      required: true, 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creds",
      required: true,
    },
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "creds" },
        text: { type: String },
        image: { type: String },
        audio: { type: String },
        document: { type: String },
        documentName: { type: String, default: "Document" },
        
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  }
);

const Group = mongoose.model("groups", groupSchema);
module.exports = Group;
