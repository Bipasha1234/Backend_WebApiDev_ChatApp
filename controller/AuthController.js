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
const generateToken = require("../config/utils"); // Import the generateToken function

// Register a new user
const register = async (req, res) => {
  const { confirmPassword, email, password } = req.body;

  try {
    // Validate required fields
    if (!confirmPassword || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const user = await Credential.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new Credential({
      email,
      password: hashedPassword,
    });

    // Save the new user
    await newUser.save();

    // Generate token after successful registration
    const token = generateToken(newUser._id, res);

    // Respond with user data and JWT token
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      token: token, // Send the generated JWT token
    });

  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
    const token = generateToken(user._id, res);

    // Respond with a success message and the generated token
    res.status(200).json({
      message: "Logged in successfully",
      token: token, // Send the generated JWT token
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

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  checkAuth,
};
