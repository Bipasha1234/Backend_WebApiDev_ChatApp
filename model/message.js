const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creds",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creds",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    
    audio: { type: String, default: "" },
    document: {
      type: String,
    },
    documentName: {
      type: String,
      default: "Document",
    },
  },
  { timestamps: true }
);

// Virtual field to get message summary (text or "Photo")
messageSchema.virtual("summary").get(function () {
  return this.image ? "Photo" : this.text || "";
});

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;
