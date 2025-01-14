const express = require('express');
const router = express.Router();
const Group = require('../model/group');
const User = require('../model/credential'); 



const CreateGroup= async (req, res) => {
  try {
    const { groupName, members } = req.body;  // Expect groupName and member IDs
    const userId = req.user._id;

    // Create new group instance
    const newGroup = new Group({
      name: groupName,
      members: [userId, ...members],  // Include user who created and invited members
      createdBy: userId,
    });

    await newGroup.save();

    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
};

const getGroups= async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Find groups where the user is a member or the creator
      const groups = await Group.find({ members: { $in: [userId] } })
        .populate('members', 'email fullName profilePic')  // Populate member details
        .exec();
  
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching groups', error });
    }
  };
  

module.exports = {
    CreateGroup,
    getGroups
};
