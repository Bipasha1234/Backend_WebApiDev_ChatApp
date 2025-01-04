
const express = require("express");
const protectRoute=require("../security/Auth");

const {
   getMessages, getUsersForSidebar, sendMessage
  } = require("../controller/messageController");
  

const router = express.Router();

router.get("/users", protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute, getMessages);
router.post("/send/:id",protectRoute, sendMessage);

module.exports= router;
