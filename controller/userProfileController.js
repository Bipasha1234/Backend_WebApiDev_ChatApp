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

module.exports = { createProfile };
