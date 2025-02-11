const express = require("express");
const protectRoute=require("../security/Auth");

const {
   getMessages, getUsersForSidebar, sendMessage,deleteChat,blockUser,
   unblockUser,
   getBlockedUsers
  } = require("../controller/messageController");

const router = express.Router();

router.get("/users", protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute, getMessages);
router.post("/send/:id",protectRoute, sendMessage);
router.delete("/delete/:id", protectRoute, deleteChat); 
router.post("/users/block/:id", protectRoute, blockUser); 
router.post("/users/unblock/:id", protectRoute, unblockUser); 
router.get("/users/blocked", protectRoute, getBlockedUsers); 

module.exports= router;
