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
  const { fullName, email, password,profilePic } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await Credential.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Credential({
      fullName,
      email,
      password: hashedPassword,
      profilePic: profilePic || "",
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
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
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await Credential.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

 const uploadImage =  (req, res) => {
  // // check for the file size and send an error message
  // if (req.file.size > process.env.MAX_FILE_UPLOAD) {
  //   return res.status(400).send({
  //     message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //   });
  // }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
}
// const uploadImage = (req, res) => {
//   if (!req.file) {
//     return res.status(400).send({ message: "Please upload a file" });
//   }

//   // Get the file name and create the full URL for accessing the image
//   const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

//   res.status(200).json({
//     success: true,
//     data: imageUrl,  // Send the URL instead of the filename
//   });
// };

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

// Add getCurrentUser to the exported functions
module.exports = {
  register,
  login,
  logout,
  checkAuth,
  updateProfile,
  uploadImage,
  getCurrentUser, // ✅ Added getCurrentUser function
};
