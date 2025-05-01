const jwt = require('jsonwebtoken');

//middleware to authenticate and decode JWT
const authMiddleware = function (req, res, next) {
  const authHeader = req.header('Authorization');

  //no token provided
  if (!authHeader) {
    console.log("No Token Provided");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //extract token from bearer<token> format
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    //verify token with secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add both forms of access: attach user ID to request in differnt formats
    req.user = {
      id: decoded.id,   // for routes expecting req.user.id
      _id: decoded.id   // for Mongoose-style consistency 
    };

    // set req.userId directly for routes that just use it raw
    req.userId = decoded.id;

    next();//proceed to next middleware/route
  } catch (err) {
    console.error("Invalid Token:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
