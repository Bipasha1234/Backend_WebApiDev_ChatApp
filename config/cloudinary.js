// Import necessary libraries
const cloudinary = require("cloudinary").v2;  // Using CommonJS for cloudinary
const dotenv = require("dotenv");  // CommonJS for dotenv

// Load environment variables
dotenv.config();

// Configure cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export cloudinary instance
module.exports = cloudinary;
