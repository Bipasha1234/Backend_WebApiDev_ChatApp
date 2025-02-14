const express = require("express");
const protectRoute = require("../security/Auth");
const { 
  createGroup, getGroups, sendGroupMessage, 
  getGroupMessages, addUserToGroup, leaveGroup, 
  updateGroupProfilePic,
  updateGroupName
} = require("../controller/groupController");

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/get", protectRoute, getGroups);
router.post("/messages/:groupId", protectRoute, sendGroupMessage);
router.get("/messages/:groupId", protectRoute, getGroupMessages);
router.post("/add-user/:groupId", protectRoute, addUserToGroup);
router.post("/leave/:groupId", protectRoute, leaveGroup);
router.put("/update-group-profile/:groupId", protectRoute,updateGroupProfilePic);
router.put("/update-group-name/:groupId", protectRoute,updateGroupName);

module.exports = router;
