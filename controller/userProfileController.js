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

const updateProfile = async (req, res) => {
    const { id } = req.params; // Extract the user profile ID from the URL parameters
    const { name, phoneNumber, gender, customerId } = req.body;

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

        // Prevent direct email updates
        if (req.body.email) {
            return res.status(400).json({ 
                message: "Email updates are not allowed here. Use the email verification flow." 
            });
        }

        // Update the user profile with the new data
        existingUser.name = name || existingUser.name;
        existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
        existingUser.gender = gender || existingUser.gender;
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

// Update Email: Step 1 - Generate OTP and send to new email
const initiateEmailUpdate = async (req, res) => {
    const { userId, newEmail } = req.body;

    try {
        // Validate input
        if (!userId || !newEmail) {
            return res.status(400).json({ message: "User ID and new email are required." });
        }

        // Check if new email is already taken
        const emailExists = await UserProfile.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        // Find the user profile
        const user = await UserProfile.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate OTP and set expiration
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        // Update user with OTP and temporarily store new email
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        user.emailToVerify = newEmail; // Temporarily store new email
        await user.save();

        // Send OTP to the new email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "your-email@gmail.com",
                pass: "your-email-password"
            },
        });

        await transporter.sendMail({
            from: "your-email@gmail.com",
            to: newEmail,
            subject: "Email Update Verification Code",
            text: `Your OTP for email update is ${otp}. It is valid for 5 minutes.`,
        });

        res.status(200).json({ message: "OTP sent to new email. Please verify." });
    } catch (error) {
        console.error("Error initiating email update:", error);
        res.status(500).json({ message: "Error initiating email update." });
    }
};

// Update Email: Step 2 - Verify OTP and update email
const verifyEmailUpdate = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        // Validate input
        if (!userId || !otp) {
            return res.status(400).json({ message: "User ID and OTP are required." });
        }

        // Find the user profile
        const user = await UserProfile.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if OTP matches and is not expired
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }
        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({ message: "OTP has expired. Please try again." });
        }

        // Update the email and clear OTP fields
        user.email = user.emailToVerify; // Update to the new email
        user.emailToVerify = null;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ message: "Email updated successfully." });
    } catch (error) {
        console.error("Error verifying email update:", error);
        res.status(500).json({ message: "Error verifying email update." });
    }
};


module.exports = {
    createProfile,
    updateProfile,
    getProfile,
    deleteProfile,
    getAllProfiles,
    initiateEmailUpdate,
    verifyEmailUpdate
};




