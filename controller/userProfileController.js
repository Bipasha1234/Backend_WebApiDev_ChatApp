const User = require('../model/userProfile'); // Import UserProfile model
const Customer = require('../model/user'); // Import Customer model

// Controller to create a new user profile
const createProfile = async (req, res) => {
    const { name, phoneNumber, gender, email, customerId } = req.body;

    try {
        // Check if the user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // If customerId is not passed in the request, we can assume it is linked to the logged-in customer
        if (!customerId) {
            return res.status(400).json({ message: "Customer ID is required." });
        }

        // Check if the customerId exists in the Customer collection
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(400).json({ message: "Invalid customer ID." });
        }

        // Create new user profile
        const newUser = new User({
            customerId,
            image: req.file ? req.file.originalname : null, // Save image filename if uploaded
            name,
            phoneNumber,
            gender,
            email
        });

        // Save the new user profile to the database
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

// Controller to update an existing user profile
const updateProfile = async (req, res) => {
    const { id } = req.params; // Extract the user profile ID from the URL parameters
    const { name, phoneNumber, gender, email, customerId } = req.body;

    try {
        // Check if the user profile exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User profile not found." });
        }

        // Check if the customerId is valid (linked to an existing customer)
        if (customerId) {
            const customer = await Customer.findById(customerId);
            if (!customer) {
                return res.status(400).json({ message: "Invalid customer ID." });
            }
        }

        // Update the user profile with the new data
        existingUser.name = name || existingUser.name;
        existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
        existingUser.gender = gender || existingUser.gender;
        existingUser.email = email || existingUser.email;
        existingUser.customerId = customerId || existingUser.customerId;
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

// Controller to get all user profiles
const getAllProfiles = async (req, res) => {
    try {
        // Fetch all user profiles
        const users = await User.find();
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
    getAllProfiles
};
