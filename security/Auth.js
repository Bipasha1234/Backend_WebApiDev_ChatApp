const jwt=require("jsonwebtoken")

const SECRET_KEY="5710a818ab4b04a3276dd4d1bfb818e8ab5588f519525f55cfadd82114be30db";

function authenticateToken(req,res,next){
    const token=req.header("Authorization")?.split(" ")[1];

    if(!token){
        return res.status(401).send("Access denied: No token provided")
       
    }

    try{
        const verified=jwt.verify(token,SECRET_KEY)
        req.user=verified;
        next()
    }catch(e){
        res.status(400).send("Invalid token")
    }
}

function authorizeRole(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send("Access Denied: Insufficient Permissions");
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };


// // Example: Admin-only route
// router.post("/admin-route", authenticateToken, authorizeRole(['admin']), (req, res) => {
//     res.send("Welcome Admin!");
// });
