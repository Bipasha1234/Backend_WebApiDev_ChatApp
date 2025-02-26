const User1 = require("../model/credential.js");
const Message = require("../model/message.js");
const cloudinary = require("../config/cloudinary.js");
const { getReceiverSocketId, io } = require("../config/socket.js");

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Get users excluding the logged-in user
    const filteredUsers = await User1.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // Fetch the latest message for each user, excluding deleted messages
    const usersWithLatestMessage = await Promise.all(
      filteredUsers.map(async (user) => {
        const latestMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
          deletedBy: { $ne: loggedInUserId }, // ✅ Exclude messages deleted by the logged-in user
        })
          .sort({ createdAt: -1 }) // Sort by most recent
          .limit(1);

        let latestMessageText = "No messages yet";
        let isUnread = false; // Track unread status

        // ✅ Determine the message type
        if (latestMessage) {
          if (latestMessage.text) {
            latestMessageText = latestMessage.text;
          } else if (latestMessage.image) {
            latestMessageText = "📷 Photo";
          } else if (latestMessage.audio) {
            latestMessageText = "🎵 Audio";
          } else if (latestMessage.document) {
            latestMessageText = "📄 Document";
          }

          // ✅ Mark as unread if the message is from the other user and not seen
          if (
            latestMessage.receiverId.toString() === loggedInUserId.toString() &&
            !latestMessage.isSeen
          ) {
            isUnread = true;
          }
        }

        return {
          ...user.toObject(),
          latestMessage: latestMessage ? latestMessageText : "No messages ", // ✅ Ensure correct display
          lastMessageTime: latestMessage ? latestMessage.createdAt : null,
          isUnread, // ✅ Add unread status
        };
      })
    );

    // ✅ Sort users based on the latest message timestamp (newest first)
    usersWithLatestMessage.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));

    

    res.status(200).json(usersWithLatestMessage);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     // Get the list of blocked users for the logged-in user
//     const loggedInUser = await User1.findById(loggedInUserId).select("blockedUsers");

//     // Get users excluding the logged-in user and those who are blocked
//     const filteredUsers = await User1.find({
//       _id: { $ne: loggedInUserId, $nin: loggedInUser.blockedUsers }, // Exclude logged-in user and blocked users
//     }).select("-password");

//     // Fetch the latest message for each user, excluding deleted messages
//     const usersWithLatestMessage = await Promise.all(
//       filteredUsers.map(async (user) => {
//         const latestMessage = await Message.findOne({
//           $or: [
//             { senderId: loggedInUserId, receiverId: user._id },
//             { senderId: user._id, receiverId: loggedInUserId },
//           ],
//           deletedBy: { $ne: loggedInUserId }, // ✅ Exclude messages deleted by the logged-in user
//         })
//           .sort({ createdAt: -1 }) // Sort by most recent
//           .limit(1);

//         let latestMessageText = "No messages yet";
//         let isUnread = false; // Track unread status

//         // ✅ Determine the message type
//         if (latestMessage) {
//           if (latestMessage.text) {
//             latestMessageText = latestMessage.text;
//           } else if (latestMessage.image) {
//             latestMessageText = "📷 Photo";
//           } else if (latestMessage.audio) {
//             latestMessageText = "🎵 Audio";
//           } else if (latestMessage.document) {
//             latestMessageText = "📄 Document";
//           }

//           // ✅ Mark as unread if the message is from the other user and not seen
//           if (
//             latestMessage.receiverId.toString() === loggedInUserId.toString() &&
//             !latestMessage.isSeen
//           ) {
//             isUnread = true;
//           }
//         }

//         return {
//           ...user.toObject(),
//           latestMessage: latestMessage ? latestMessageText : "No messages ", // ✅ Ensure correct display
//           lastMessageTime: latestMessage ? latestMessage.createdAt : null,
//           isUnread, // ✅ Add unread status
//         };
//       })
//     );

//     // ✅ Sort users based on the latest message timestamp (newest first)
//     usersWithLatestMessage.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));

//     res.status(200).json(usersWithLatestMessage);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


const markMessagesAsSeen = async (req, res) => {
  try {
    const { senderId } = req.body; // Sender whose messages should be marked as read
    const receiverId = req.user._id; // The logged-in user (recipient)

    await Message.updateMany(
      { senderId, receiverId, isSeen: false },
      { $set: { isSeen: true } }
    );

    res.status(200).json({ success: true, message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const markMessagesAsUnread = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user._id; // Get the logged-in user

    // Update messages from the selected user, marking them as unseen
    await Message.updateMany(
      { senderId: userId, receiverId: loggedInUserId, isSeen: true },
      { $set: { isSeen: false } }
    );

    res.status(200).json({ message: "Messages marked as unread" });
  } catch (error) {
    console.error("Error marking messages as unread:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all messages between logged-in user and the user to chat with
const getMessages = async (req, res) => {
  try {
    const { id: chatPartnerId } = req.params;
    // const {  chatPartnerId } = req.params.id;
    const loggedInUserId = req.user._id; 

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: loggedInUserId }
      ],
      deletedBy: { $ne: loggedInUserId } // ✅ Exclude messages deleted by this user
    }).sort({ createdAt: 1 });

    res.status(200).json(messages || []);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getMessages = async (req, res) => {
//   try {
//     const { chatPartnerId } = req.params;
//     const loggedInUserId = req.user._id; 

//     console.log("Logged-in User ID:", loggedInUserId);
//     console.log("Chat Partner ID:", chatPartnerId);

//     if (!mongoose.Types.ObjectId.isValid(chatPartnerId)) {
//       return res.status(400).json({ error: "Invalid chat partner ID." });
//     }

//     const messages = await Message.find({
//       $or: [
//         { senderId: new mongoose.Types.ObjectId(loggedInUserId), receiverId: new mongoose.Types.ObjectId(chatPartnerId) },
//         { senderId: new mongoose.Types.ObjectId(chatPartnerId), receiverId: new mongoose.Types.ObjectId(loggedInUserId) }
//       ],
//       deletedBy: { $ne: loggedInUserId }
//     }).sort({ createdAt: 1 });

//     console.log("Fetched Messages:", messages);

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error("Error in getMessages:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const mongoose = require("mongoose");


const sendMessage = async (req, res) => {
  try {
    const { text, image, audio, document, documentName } = req.body;
    // const {  receiverId } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log("Received receiverId:", receiverId); // Debugging line

    // 🔹 Check if the receiverId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid receiver ID." });
    }

    // 🔹 Check if sender is blocked by the receiver
    const receiver = await User1.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found." });
    }

    if (receiver.blockedUsers.includes(senderId)) {
      return res.status(403).json({ error: "You have been blocked by this user." });
    }

    // Proceed with sending message
    let imageUrl = "", audioUrl = "", documentUrl = "";
    if (image && typeof image === "string" && image.startsWith("data:image/")) {
      const uploadResponse = await cloudinary.uploader.upload(image, { resource_type: "image" });
      imageUrl = uploadResponse.secure_url;
    }

    if (audio && typeof audio === "string" && audio.startsWith("data:audio/")) {
      const uploadResponse = await cloudinary.uploader.upload(audio, { resource_type: "auto" });
      audioUrl = uploadResponse.secure_url;
    }

    if (document && typeof document === "string") {
      const uploadResponse = await cloudinary.uploader.upload(document, {
        resource_type: "raw",
        public_id: `documents/${Date.now()}-${documentName.split(".")[0]}`,
        use_filename: true,
        unique_filename: false,
      });
      documentUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl || null,
      audio: audioUrl || null,
      document: documentUrl || null,
      documentName: documentName || null,
    });

    await newMessage.save();
    console.log("messages",newMessage);
    
    // Emit the new message via WebSocket (optional if using a real-time feature)
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ 
      success: true, 
      message: "Message sent successfully", 
      data: newMessage 
    });
    
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteChat = async (req, res) => {
  try {
    const { id: userToDelete } = req.params;
    const loggedInUserId = req.user._id;

    // ✅ Soft delete: Add user ID to `deletedBy`
    await Message.updateMany(
      {
        $or: [
          { senderId: loggedInUserId, receiverId: userToDelete },
          { senderId: userToDelete, receiverId: loggedInUserId }
        ]
      },
      { $addToSet: { deletedBy: loggedInUserId } } // ✅ Track deleted messages
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};





const blockUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const loggedInUserId = req.user._id;

    await User1.findByIdAndUpdate(
      loggedInUserId,
      { $addToSet: { blockedUsers: userId } },
      { new: true }
    );

    const updatedUser = await User1.findById(loggedInUserId).populate("blockedUsers", "fullName _id");
    res.status(200).json({ blockedUsers: updatedUser.blockedUsers });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Failed to block user" });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { id: userId } = req.params; 
    const loggedInUserId = req.user._id;

    await User1.findByIdAndUpdate(
      loggedInUserId,
      { $pull: { blockedUsers: userId } }, 
      { new: true }
    );

    const updatedUser = await User1.findById(loggedInUserId).populate("blockedUsers", "fullName _id profilePic");
    const unblockedUser = await User1.findById(userId).select("fullName _id profilePic");

    return res.status(200).json({
      blockedUsers: updatedUser.blockedUsers, 
      unblockedUser, 
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    return res.status(500).json({ message: "Failed to unblock user" });
  }
};

const getBlockedUsers = async (req, res) => {
  try {
    const loggedInUser = await User1.findById(req.user._id).populate("blockedUsers", "fullName _id");
    res.status(200).json({ blockedUsers: loggedInUser.blockedUsers });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    res.status(500).json({ message: "Failed to fetch blocked users" });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  deleteChat, 
  blockUser, 
  unblockUser,
  getBlockedUsers  ,
  markMessagesAsSeen,
  markMessagesAsUnread
};
// const User1 = require("../model/credential.js");
// const Message = require("../model/message.js");
// const cloudinary = require("../config/cloudinary.js");
// const { getReceiverSocketId, io } = require("../config/socket.js");

// const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     // Get users excluding the logged-in user
//     const filteredUsers = await User1.find({ _id: { $ne: loggedInUserId } })
//       .select("-password");

//     // Fetch the latest message for each user
//     const usersWithLatestMessage = await Promise.all(filteredUsers.map(async (user) => {
//       const latestMessage = await Message.findOne({
//         $or: [
//           { senderId: loggedInUserId, receiverId: user._id },
//           { senderId: user._id, receiverId: loggedInUserId }
//         ]
//       })
//       .sort({ createdAt: -1 }) // Sort by most recent
//       .limit(1);

//       // Initialize latest message text as "No messages yet"
//       let latestMessageText = "No messages yet";

//       // If there's a latest message, update the text accordingly
//       if (latestMessage) {
//         if (latestMessage.text) {
//           latestMessageText = latestMessage.text; // For text messages
//         } else if (latestMessage.image) {
//           latestMessageText = "📷Photo"; // For image messages
//         }
//       }

//       return {
//         ...user.toObject(),
//         latestMessage: latestMessageText, // Set the latest message text
//         lastMessageTime: latestMessage ? latestMessage.createdAt : null, // Add lastMessageTime
//       };
//     }));

//     res.status(200).json(usersWithLatestMessage);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// // Get all messages between logged-in user and the user to chat with
// const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId },
//         { senderId: userToChatId, receiverId: myId },
//       ],
//     }).sort({ createdAt: 1 }); // Sort by ascending order of createdAt for the conversation flow

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Send a message from the logged-in user to another user
// const sendMessage = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     let imageUrl = "";
//     let documentUrl = "";

//     // **🔹 Handle Image Upload (Base64 from Camera or Gallery)**
//     if (req.body.image) {
//       if (req.body.image.startsWith("data:image/")) {
//         console.log("Processing base64 image...");
//         const uploadResponse = await cloudinary.uploader.upload(req.body.image);
//         imageUrl = uploadResponse.secure_url;
//       } else {
//         return res.status(400).json({ error: "Invalid image format." });
//       }
//     }

//     // **🔹 Handle Document Upload (File via FormData)**
//     if (req.file) {
//       console.log("Processing document upload...");
//       const docUploadResponse = await cloudinary.uploader.upload(req.file.path, {
//         resource_type: "raw", // Allows all file types (PDF, DOCX, XLS, etc.)
//         folder: "chat_documents", // Store in a specific folder
//       });
//       documentUrl = docUploadResponse.secure_url;
//     }

//     // **🔹 Create and Save the New Message**
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl || null,
//       document: documentUrl || null,
//     });

//     await newMessage.save();

//     // **🔹 Emit Message via WebSockets**
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.error("Error in sendMessage controller:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// module.exports = {
//   getUsersForSidebar,
//   getMessages,
//   sendMessage,
// };
