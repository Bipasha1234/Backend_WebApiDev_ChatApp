const User = require('../model/userProfile'); 

// Controller to create a new user profile
const createProfile = async (req, res) => {
    const { name, phoneNumber, gender, email } = req.body;

    try {
        // Check if the user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Create new user
        const newUser = new User({ name, phoneNumber, gender, email });

        // Save the new user to the database
        await newUser.save();

        // Respond with success
        res.status(201).json({
            message: "Profile created successfully.",
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the profile." });
    }
};

module.exports = { createProfile };
