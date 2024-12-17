const PinSecurity = require('../model/pinSecurity');
const UserProfile = require('../model/userProfile');
const bcrypt = require('bcryptjs');

// Create or Update PIN for User
const createPin = async (req, res) => {
    const { userProfileId, pin } = req.body;

    try {
        // Check if the user exists by userProfileId
        const userProfile = await UserProfile.findById(userProfileId);
        if (!userProfile) {
            return res.status(400).json({ message: 'User profile not found' });
        }

        // Hash the PIN before saving
        const hashedPin = await bcrypt.hash(pin, 10);

        // Check if PIN already exists for the user
        let pinSecurity = await PinSecurity.findOne({ userProfileId });
        if (pinSecurity) {
            // If the PIN already exists, update it
            pinSecurity.pin = hashedPin;
            await pinSecurity.save();
        } else {
            // If no PIN exists for the user, create a new entry
            pinSecurity = new PinSecurity({
                userProfileId,
                pin: hashedPin,
            });
            await pinSecurity.save();
        }

        res.status(201).json({ message: 'PIN created/updated successfully' });
    } catch (err) {
        console.error('Error creating PIN:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Authenticate User using PIN
const authenticatePin = async (req, res) => {
    const { userProfileId, pin } = req.body;

    try {
        // Find the user by userProfileId
        const userProfile = await UserProfile.findById(userProfileId);
        if (!userProfile) {
            return res.status(400).json({ message: 'User profile not found' });
        }

        // Find the PIN for the user
        const pinSecurity = await PinSecurity.findOne({ userProfileId });
        if (!pinSecurity) {
            return res.status(400).json({ message: 'PIN not set for this user' });
        }

        // Compare the provided PIN with the hashed PIN
        const isMatch = await bcrypt.compare(pin, pinSecurity.pin);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid PIN' });
        }

        // Respond with success
        res.status(200).json({ message: 'PIN authenticated successfully' });
    } catch (err) {
        console.error('Error authenticating PIN:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createPin, authenticatePin };
