const Customer = require("../model/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const save = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        let customer = await Customer.findOne({ email });

        if (!customer) {
            // Create a new customer
            customer = new Customer({ email });

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

        // Generate a new OTP for an existing customer
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        customer.otp = hashedOtp;
        customer.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 1 minute

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

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        if (customer.otp !== hashedOtp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        if (new Date() > customer.otpExpiresAt) {
            return res.status(400).json({ message: "OTP expired." });
        }

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

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        const currentTime = new Date();
        if (customer.otpExpiresAt && currentTime < customer.otpExpiresAt) {
            return res.status(400).json({
                message: "OTP is still valid. Please wait before requesting a new OTP."
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        customer.otp = hashedOtp;
        customer.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);

        await customer.save();
        await sendOtpEmail(customer.email, otp);

        res.status(200).json({ message: "New OTP sent to email successfully." });
    } catch (e) {
        console.error("Error in sending OTP:", e.message);
        res.status(500).json({
            message: "An error occurred while sending the OTP.",
            error: e.message
        });
    }
};

module.exports = {
    findAll: async (req, res) => {
        try {
            const customers = await Customer.find();
            res.status(200).json(customers);
        } catch (e) {
            res.status(500).json(e);
        }
    },
    save,
    verifyOtp,
    resendOtp,
    findById: async (req, res) => {
        try {
            const customer = await Customer.findById(req.params.id);
            res.status(200).json(customer);
        } catch (e) {
            res.status(500).json(e);
        }
    },
    deleteById: async (req, res) => {
        try {
            await Customer.findByIdAndDelete(req.params.id);
            res.status(200).json("Customer deleted.");
        } catch (e) {
            res.status(500).json(e);
        }
    },
    update: async (req, res) => {
        try {
            const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(updatedCustomer);
        } catch (e) {
            res.status(500).json(e);
        }
    },
};
