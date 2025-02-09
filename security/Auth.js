// const jwt=require("jsonwebtoken")

// // const SECRET_KEY="5710a818ab4b04a3276dd4d1bfb818e8ab5588f519525f55cfadd82114be30db";

// function authenticateToken(req,res,next){
//     const token=req.header("Authorization")?.split(" ")[1];

//     if(!token){
//         return res.status(401).send("Access denied: No token provided")
       
//     }

//     try{
//         const verified=jwt.verify(token,JWT_SECRET);
//         req.user=verified;
//         next()
//     }catch(e){
//         res.status(400).send("Invalid token")
//     }
// }

// function authorizeRole(roles) {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).send("Access Denied: Insufficient Permissions");
//         }
//         next();
//     };
// }

// module.exports = { authenticateToken, authorizeRole };


// // // Example: Admin-only route
// // router.post("/admin-route", authenticateToken, authorizeRole(['admin']), (req, res) => {
// //     res.send("Welcome Admin!");
// // });


const jwt = require('jsonwebtoken');

const User = require ("../model/credential.js");

// const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized - No Token Provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded) {
//       return res.status(401).json({ message: "Unauthorized - Invalid Token" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.log("Error in protectRoute middleware: ", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = protectRoute;

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1]; // Read from headers if no cookie

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = protectRoute;