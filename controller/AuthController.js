const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Credential = require("../model/credential");


const SECRET_KEY = "5710a818ab4b04a3276dd4d1bfb818e8ab5588f519525f55cfadd82114be30db";

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if username or email already exists
        const existingUser = await Credential.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new credential document
        const cred = new Credential({ username, email, password: hashedPassword, role });
        await cred.save();

        // Send response
        res.status(201).json(cred);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const cred = await Credential.findOne({ username });
        if (!cred || !(await bcrypt.compare(password, cred.password))) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: cred.username, role: cred.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Send response with token
        res.json({ token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    register
};
