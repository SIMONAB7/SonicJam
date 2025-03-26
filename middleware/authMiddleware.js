// // const jwt = require('jsonwebtoken');

// // module.exports = function (req, res, next) {
// //   const token = req.header('Authorization');

// //   if (!token) {
// //     console.log("❌ No Token Provided");
// //     return res.status(401).json({ msg: "No token, authorization denied" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded.id;
// //     next();
// //   } catch (err) {
// //     console.error("❌ Invalid Token:", err);
// //     res.status(401).json({ msg: "Invalid token" });
// //   }
// // };

// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   const authHeader = req.header('Authorization');

//   if (!authHeader) {
//     console.log(" No Token Provided");
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   // check if token has "Bearer " prefix
//   const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.id;  // ensure req.user contains the correct user ID
//     next();
//   } catch (err) {
//     console.error(" Invalid Token:", err);
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };


const jwt = require('jsonwebtoken');

const authMiddleware = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    console.log("No Token Provided");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("Invalid Token:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
