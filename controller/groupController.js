const Group = require("../model/group");
const User = require("../model/credential");
const cloudinary = require("../config/cloudinary");  
const mongoose = require("mongoose");

const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image, audio, document,documentName } = req.body;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

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
    const newMessage = {
      senderId,
      text,
      image: imageUrl,
      audio: audioUrl,
      document: documentUrl,
      documentName: documentName || null,
      
      createdAt: new Date(),
    };

    group.messages.push(newMessage);
    await group.save();

    await group.populate('messages.senderId', 'fullName profilePic');

    res.status(201).json({
      message: "Message sent",
      newMessage: group.messages[group.messages.length - 1], 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




const createGroup = async (req, res) => {
  try {
    console.log("➡️ Create Group Request:", req.body);

    const { groupName, members, profilePic } = req.body;
    const userId = req.user?._id;

    if (!groupName || !members || members.length < 2) {
      return res.status(400).json({ message: "Group name and at least 2 members are required" });
    }

    const newGroup = new Group({
      name: groupName,
      profilePic: profilePic || "",
      members: [userId, ...members],
      createdBy: userId,
      admin: userId, 
    });

    await newGroup.save();
    console.log("✅ Group created successfully:", newGroup);

    res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error("❌ Error creating group:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .populate("members", "fullName profilePic")
      .populate("admin", "fullName profilePic"); 

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("messages.senderId", "fullName profilePic")
      .select("messages profilePic name");

    if (!group) return res.status(404).json({ error: "Group not found" });

    console.log("Populated messages:", group.messages); 

    res.status(200).json({
      messages: group.messages,
      profilePic: group.profilePic,
      groupName: group.name,
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Internal server error" });
  }
};

const addUserToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    console.log("User ID from request:", userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find group by ID
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    console.log("Group Members:", group.members.map(m => m.toString()));

    // Check if user exists in the user database
    const user = await User.findById(userObjectId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if user is already in the group
    if (group.members.some(member => member.toString() === userObjectId.toString())) {
      return res.status(400).json({ error: "User is already in the group" });
    }

    // Add user to the group
    group.members.push(userObjectId);
    await group.save();

    res.status(200).json({ message: "User added to group", group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.members = group.members.filter(member => member.toString() !== userId.toString());

    if (group.members.length === 0) {
      await Group.findByIdAndDelete(groupId);
    } else {
      await group.save();
    }

    res.status(200).json({ message: "Left the group", group });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


const updateGroupProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body; // Expect Base64 string
    const groupId = req.params.groupId;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Log to check incoming data
    console.log("Received profilePic (Base64 string):", profilePic.slice(0, 100)); // Log first 100 characters

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "group_pics", // Optional folder
    });

    console.log("Cloudinary upload response:", uploadResponse);

    // Update the group profile in the database with Cloudinary's URL
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedGroup); // Respond with updated group
  } catch (error) {
    console.log("Error in update group profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateGroupName = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { groupName } = req.body;

    if (!groupName) {
      return res.status(400).json({ message: "New group name is required" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.name = groupName; 
    await group.save(); 

    res.status(200).json({ message: "Group name updated successfully", group });
  } catch (error) {
    console.error("Error updating group name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createGroup,
  getGroups,
  sendGroupMessage,
  getGroupMessages,
  addUserToGroup,
  leaveGroup,
  updateGroupProfilePic,
  updateGroupName, 
};
