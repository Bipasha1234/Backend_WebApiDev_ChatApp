const Customer = require("../model/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const save = async (req, res) => {
    try {
        const { email, userProfileId } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        // Check if the userProfileId is valid (optional)
        if (userProfileId) {
            const userProfileExists = await UserProfile.findById(userProfileId);
            if (!userProfileExists) {
                return res.status(400).json({ message: "Invalid userProfileId." });
            }
        }

        let customer = await Customer.findOne({ email });

        if (!customer) {
            customer = new Customer({
                email,
                userProfileId: userProfileId || null, // Optional linking
            });

            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Hash OTP using SHA-256
            const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

            customer.otp = hashedOtp;
            customer.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 1 minute

            await customer.save();
            await sendOtpEmail(customer.email, otp);

            return res.status(200).json({ message: "OTP sent to email successfully." });
        }

        if (!userProfileId) {
            return res.status(400).json({ message: "userProfileId is required for existing users." });
        }

        // Generate a new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP using SHA-256
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        customer.otp = hashedOtp;
        customer.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 1 minute
        customer.userProfileId = userProfileId;

        await customer.save();
        await sendOtpEmail(customer.email, otp);

        return res.status(200).json({ message: "OTP sent to email successfully." });

    } catch (e) {
        console.error("Error saving customer:", e.message);
        res.status(500).json({ message: "An error occurred while saving the customer.", error: e.message });
    }
};


// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "bipashalamsal@gmail.com",
            pass: "vosdyrvhuuymfyre"
        },
    });

    await transporter.sendMail({
        from: "bipashalamsal@gmail.com",
        to: email,
        subject: "Your OTP Code",
        html: `
            <h1>Email Verification</h1>
            <p>Please use the OTP below to verify your email:</p>
            <h2>${otp}</h2>
            <p>This OTP is valid for 1 minute.</p>
        `,
    });
};

module.exports = {
    save,
};


const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check if email and OTP are provided
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        // Find the customer by email
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        // Hash the entered OTP to compare it with the stored hash
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        // Check if OTP matches
        if (customer.otp !== hashedOtp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // Check if OTP is expired
        if (new Date() > customer.otpExpiresAt) {
            return res.status(400).json({ message: "OTP expired." });
        }

        // Clear OTP fields upon successful verification
        customer.otp = null;
        customer.otpExpiresAt = null;
        await customer.save();

        res.status(200).json({ message: "OTP verified successfully." });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error verifying OTP.", error: e.message });
    }
};


const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email input
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        // Find customer by email
        let customer = await Customer.findOne({ email });

        // If customer does not exist, return an error
        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        // Check if OTP has expired (if current time is greater than OTP expiration)
        const currentTime = new Date();
        if (customer.otpExpiresAt && currentTime < customer.otpExpiresAt) {
            return res.status(400).json({
                message: "OTP is still valid. Please wait before requesting a new OTP."
            });
        }

        // Generate a new OTP and set a new expiration time (valid for 1 minute)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 1 minute

        // Update the customer's OTP and expiration time
        customer.otp = otp;
        customer.otpExpiresAt = otpExpiresAt;

        // Save the updated customer data
        await customer.save();

        // Send OTP via email using nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "bipashalamsal@gmail.com",
                pass: "vosdyrvhuuymfyre"
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Your email (from env variable)
            to: email,
            subject: "Your OTP Code",
            html: `
                <h1>Email Verification</h1>
                <p>Please use the OTP below to verify your email:</p>
                <h2>${otp}</h2>
                <p>This OTP is valid for 1 minute.</p>
            `
        });

        // Respond with success message
        res.status(200).json({ message: "New OTP sent to email successfully." });
    } catch (e) {
        console.error("Error in sending OTP:", e.message);

        // Handle specific errors or fallback to a generic error
        res.status(500).json({
            message: "An error occurred while sending the OTP.",
            error: e.message
        });
    }
};

const findAll = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (e) {
        res.json(e);
    }
};

const findById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.status(200).json(customer);
    } catch (e) {
        res.json(e);
    }
};

const deleteById = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json("Customer deleted.");
    } catch (e) {
        res.json(e);
    }
};

const update = async (req, res) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json("Customer updated.");
    } catch (e) {
        res.json(e);
    }
};

module.exports = {
    findAll,
    save,
    verifyOtp,
    resendOtp,
    findById,
    deleteById,
    update,
};
