const express = require("express");

const {
   createChat,
   sendMessage,
   getAllMessages
} = require("../controller/userController");

const router = express.Router();

router.post('/create', createChat);
router.post('/send',sendMessage);
// Get all messages from a private chat
router.get('/:chatId',getAllMessages);


module.exports = router;
