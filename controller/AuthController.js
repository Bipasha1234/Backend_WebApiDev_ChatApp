const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Credential = require("../model/credential");

const SECRET_KEY = "5710a818ab4b04a3276dd4d1bfb818e8ab5588f519525f55cfadd82114be30db";

// Register a new user
const register = async (req, res) => {
    try {
        const { email, password, confirmPassword, role } = req.body;

        // Check if all fields are provided
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if email already exists
        const existingUser = await Credential.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const cred = new Credential({ email, password: hashedPassword, role });
        await cred.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: { email, role }
        });
    } catch (e) {
        console.error('Error during registration:', e.message);
        res.status(500).json({ message: 'Server error', error: e.message });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const cred = await Credential.findOne({ email });
        if (!cred || !(await bcrypt.compare(password, cred.password))) {
            return res.status(403).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: cred.email, role: cred.role },
            SECRET_KEY,
            { expiresIn: '1h' }  // Token expires in 1 hour
        );

        // Send response with token
        res.json({ token });
    } catch (e) {
        console.error('Error during login:', e.message);
        res.status(500).json({ message: 'Server error', error: e.message });
    }
};

module.exports = {
    register,
    login
};