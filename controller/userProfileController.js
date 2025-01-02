const User = require('../model/userProfile');
const Credential = require('../model/credential'); 
const bcrypt = require('bcryptjs');

// No authentication required for public profile creation (e.g., user registration)
const createProfile = async (req, res) => {
    const { name, phoneNumber, gender, email } = req.body;
 
    try {
        const newProfile = await User.create({
            name,
            phoneNumber,
            gender,
            email,
        });
        res.status(201).json(newProfile);
    } catch (error) {
        console.error("Profile creation error:", error); 
        res.status(400).json({ error: error.message });
    }
 };
 


// Controller to update user profile
const updateProfile = async (req, res) => {
    const { id } = req.params; // Extract the user profile ID from the URL parameters
    const { name, phoneNumber, gender} = req.body; // Remove email from req.body

    try {
        // Check if the user profile exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User profile not found." });
        }

        // Check if the userId exists and matches the profile
        const existingCustomer = await Credential.findById(userId);
        if (!existingCustomer) {
            return res.status(400).json({ message: "Invalid customer ID." });
        }


        // Update the user profile with the new data, excluding email
        existingUser.name = name || existingUser.name;
        existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
        existingUser.gender = gender || existingUser.gender;
        existingUser.userId = userId || existingUser.userId;
        existingUser.image = req.file ? req.file.originalname : existingUser.image; // Update image if uploaded

        // Save the updated profile to the database
        await existingUser.save();

        // Respond with success
        res.status(200).json({
            message: "Profile updated successfully.",
            user: existingUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the profile." });
    }
};




// Controller to get a user profile by ID
const getProfile = async (req, res) => {
    const { id } = req.params; // Extract the user profile ID from the URL parameters

    try {
        // Find the user profile by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User profile not found." });
        }

        // Respond with the user profile data
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the profile." });
    }
};

// Controller to delete a user profile by ID
const deleteProfile = async (req, res) => {
    const { id } = req.params; // Extract the user profile ID from the URL parameters

    try {
        // Find and delete the user profile by ID
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User profile not found." });
        }

        // Respond with success message
        res.status(200).json({ message: "User profile deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the profile." });
    }
};



const initiateEmailUpdate = async (req, res) => {
    try {
        const { id, currentPassword, newEmail } = req.body;

        // Validate input fields
        if (!id || !currentPassword || !newEmail) {
            return res.status(400).json({ message: 'All fields are required: id, currentPassword, newEmail' });
        }

        // Validate new email format (basic regex check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find user by ID
        const cred = await Credential.findById(id);
        if (!cred) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the current password
        const isPasswordValid = await bcrypt.compare(currentPassword, cred.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Invalid password' });
        }

        // Check if the new email is already in use
        const emailExists = await Credential.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(409).json({ message: 'Email is already in use' });
        }

        // Update the email
        cred.email = newEmail;
        await cred.save();

        // Send success response
        res.json({ 
            message: 'Email updated successfully', 
            id: cred._id, 
            email: cred.email 
        });
    } catch (e) {
        console.error('Error updating email:', e);

        // Differentiated error handling
        if (e.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data provided' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to get all user profiles
const getAllProfiles = async (req, res) => {
    try {
        // Retrieve all user profiles from the database
        const users = await User.find();

        // If no profiles are found
        if (users.length === 0) {
            return res.status(404).json({ message: "No user profiles found." });
        }

        // Respond with the list of user profiles
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the profiles." });
    }
};


module.exports = {
    createProfile,
    updateProfile,
    getProfile,
    deleteProfile,
    getAllProfiles,
    initiateEmailUpdate
};




