// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const Credential = require("../model/credential");

// // const SECRET_KEY = "5710a818ab4b04a3276dd4d1bfb818e8ab5588f519525f55cfadd82114be30db";

// // // Register a new user
// // const register = async (req, res) => {
// //     try {
// //         const { email, password, confirmPassword, role } = req.body;

// //         // Check if all fields are provided
// //         if (!email || !password || !confirmPassword) {
// //             return res.status(400).json({ message: 'All fields are required' });
// //         }

// //         // Check if passwords match
// //         if (password !== confirmPassword) {
// //             return res.status(400).json({ message: 'Passwords do not match' });
// //         }

// //         // Check if email already exists
// //         const existingUser = await Credential.findOne({ email });
// //         if (existingUser) {
// //             return res.status(400).json({ message: 'Email already exists' });
// //         }

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 10);

// //         // Create and save the new user
// //         const cred = new Credential({ email, password: hashedPassword, role });
// //         await cred.save();

// //         res.status(201).json({
// //             message: 'User registered successfully',
// //             user: { email, role }
// //         });
// //     } catch (e) {
// //         console.error('Error during registration:', e.message);
// //         res.status(500).json({ message: 'Server error', error: e.message });
// //     }
// // };

// // // Login a user
// // const login = async (req, res) => {
// //     try {
// //         const { email, password } = req.body;

// //         // Find the user by email
// //         const cred = await Credential.findOne({ email });
// //         if (!cred || !(await bcrypt.compare(password, cred.password))) {
// //             return res.status(403).json({ message: 'Invalid email or password' });
// //         }

// //         // Generate JWT token
// //         const token = jwt.sign(
// //             { email: cred.email, role: cred.role },
// //             SECRET_KEY,
// //             { expiresIn: '1h' }  // Token expires in 1 hour
// //         );

// //         // Send response with token
// //         res.json({ token });
// //     } catch (e) {
// //         console.error('Error during login:', e.message);
// //         res.status(500).json({ message: 'Server error', error: e.message });
// //     }
// // };

// // module.exports = {
// //     register,
// //     login
// // };




// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Credential = require("../model/credential");

// const generateToken = require("../config/utils");
// // import cloudinary from "../lib/cloudinary.js";

// // const SECRET_KEY = "5710a818ab4b04a3276dd4d1bfb818e8ab5588f519525f55cfadd82114be30db";

// // Register a new user
// const register = async (req, res) => {
//     const { confirmPassword, email, password } = req.body;
  
//     try {
//       // Validate required fields
//       if (!confirmPassword || !email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//       }
  
//       // Validate password length
//       if (password.length < 6) {
//         return res.status(400).json({ message: "Password must be at least 6 characters" });
//       }
  
//       // Check if passwords match
//       if (password !== confirmPassword) {
//         return res.status(400).json({ message: "Passwords do not match" });
//       }
  
//       // Check if email already exists
//       const user = await Credential.findOne({ email });
//       if (user) {
//         return res.status(400).json({ message: "Email already exists" });
//       }
  
//       // Hash the password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
  
//       // Create a new user
//       const newUser = new Credential({
//         email,
//         password: hashedPassword,
//       });
  
//       // Save the new user
//       await newUser.save();
  
//       // Respond with user data and JWT token
//       res.status(201).json({
//         _id: newUser._id,
//         email: newUser.email,
//         token: generateToken(newUser._id), // Add the generated JWT
//       });
  
//     } catch (error) {
//       console.error("Error in signup controller:", error.message);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };
  

// // Login route
// const login = async (req, res) => {
//     const { email, password } = req.body;
//   try {
//     const user = await Credential.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     generateToken(user._id, res);

//     res.status(200).json({
//         message: "Logged in successfully"
//     });
//   } catch (error) {
//     console.log("Error in login controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
 

//    const logout = (req, res) => {
//     try {
//       res.cookie("jwt", "", { maxAge: 0 });
//       res.status(200).json({ message: "Logged out successfully" });
//     } catch (error) {
//       console.log("Error in logout controller", error.message);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };
//   const checkAuth = (req, res) => {
//     try {
//       res.status(200).json(req.user);
//     } catch (error) {
//       console.log("Error in checkAuth controller", error.message);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };

// module.exports = {
//     register,
//     login,
   
//     logout,
//     checkAuth
// };


const bcrypt = require('bcryptjs');
const Credential = require("../model/credential");
const generateToken = require("../config/utils");
const cloudinary = require( "../config/cloudinary.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");  // CommonJS for dotenv

// Load environment variables
dotenv.config();
// const { sendVerificationEmail } = require('../utils/emailService');
// const { generateVerificationCode } = require('../Utils/emailVerification.js');

// Register a new user
// const register = async (req, res) => {
//   const { fullName, email, password } = req.body;
//   try {
//     if (!fullName || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const user = await Credential.findOne({ email });

//     if (user) return res.status(400).json({ message: "Email already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new Credential({
//       fullName,
//       email,
//       password: hashedPassword,
//     });

//     if (newUser) {
//       // generate jwt token here
//       generateToken(newUser._id, res);
//       await newUser.save();

//       res.status(201).json({
//         _id: newUser._id,
//         fullName: newUser.fullName,
//         email: newUser.email,
//         profilePic: newUser.profilePic,
//       });
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     console.log("Error in signup controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const register = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;

  try {
    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if the user already exists
    const user = await Credential.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new Credential({
      fullName,
      email,
      password: hashedPassword,
      profilePic: profilePic || "",
    });

    // If user creation is successful
    if (newUser) {
      // Generate JWT token
      generateToken(newUser._id, res);

      // Save the user to the database
      await newUser.save();

      // Send success response with user details and a success message
      res.status(201).json({
        message: "User registered successfully",  // Add this message here
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login route
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await Credential.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate token after successful login
//     const token = generateToken(user._id, res);
//     // Respond with a success message and the generated token
//     res.status(200).json({
//       message: "Logged in successfully",
//       token: token, // Send the generated JWT token
//     });
//   } catch (error) {
//     console.log("Error in login controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// Login route
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Credential.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token after successful login
    const token = generateToken(user._id, res); // Generate a JWT token

    // Respond with user details and token
    res.status(200).json({
      message: "Logged in successfully",
      token: token, // Send the generated JWT token
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic || "",
      }
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Logout route (Clear the cookie)
const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, fullName, profilePic } = req.body;
    const userId = req.user._id; // Assuming the user ID is retrieved from authentication middleware

    // Initialize update fields object
    const updateFields = {};

    // Check if profilePic is provided and upload it to Cloudinary
    if (profilePic) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
          folder: "user_profile_pics", // Optional folder in Cloudinary
          transformation: [{ width: 150, height: 150, crop: "fill" }], // Optional image transformation
        });
        updateFields.profilePic = uploadResponse.secure_url; // Store the Cloudinary URL
      } catch (cloudinaryError) {
        return res.status(500).json({ message: "Error uploading profile picture", error: cloudinaryError.message });
      }
    }

    // Update fields if provided
    if (email) {
      updateFields.email = email;
    }

    if (fullName) {
      updateFields.fullName = fullName;
    }

    // If no fields to update, return a message
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update the user profile with the fields that are provided
    const updatedUser = await Credential.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user details as a response
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


 const uploadImage =  (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
}

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await Credential.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

// Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Forgot Password - Generates reset code and sends it via email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Credential.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User with this email does not exist" });
    }

    // Generate a 6-digit reset code
    const resetCode = String(crypto.randomInt(100000, 1000000));

    // Hash the reset code before storing (better security)
    const hashedResetCode = await bcrypt.hash(resetCode, 10);

    // Store hashed reset code and expiration (valid for 15 minutes)
    user.resetCode = hashedResetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send reset code via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    });

    res.status(200).json({ message: "Reset code sent to your email" });

  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify Reset Code Controller
const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    // Find user by email
    const user = await Credential.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if reset code is expired
    if (!user.resetCode || !user.resetCodeExpires || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Compare the entered reset code with the hashed one in the database
    const isMatch = await bcrypt.compare(resetCode, user.resetCode);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    // Nullify reset code and expiration after verification
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.status(200).json({ message: "Reset code verified successfully. You can now reset your password." });
  } catch (error) {
    console.error("Error in verifyResetCode:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Credential.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const updateProfileApp = async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const userId = req.user._id; // Get user ID from authentication middleware

    // Initialize update fields object
    const updateFields = {};

    // Check if a profile picture is uploaded and store the filename
    if (req.file) {
      updateFields.profilePic = req.file.filename; // Save only the filename, not the full path
    }

    // Check if email is provided
    if (email) {
      updateFields.email = email;
    }

    // Check if fullName is provided
    if (fullName) {
      updateFields.fullName = fullName;
    }

    // If no fields to update, return an error message
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update the user profile in the database
    const updatedUser = await Credential.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user details
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// Add getCurrentUser to the exported functions
module.exports = {
  register,
  login,
  logout,
  checkAuth,
  updateProfile,
  uploadImage,
  getCurrentUser, 
  forgotPassword,
  resetPassword,
  verifyResetCode,
  updateProfileApp
};
