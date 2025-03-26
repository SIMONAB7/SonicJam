const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../server/models/User'); //  Import User Model
const authMiddleware = require('../middleware/authMiddleware');
const multer = require("multer");
const path = require("path");
require('dotenv').config(); //  Load .env file

// REGISTER USER
router.post('/register', async (req, res) => {
  try {
    console.log("Received Register Request:", req.body);

    const { name, email, password } = req.body;

    // Check if MongoDB is ready
    if (!User.db.readyState) {
      console.error(" Database not connected!");
      return res.status(500).json({ msg: "Database not connected" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists:", email);
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create new user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log("User Registered Successfully:", user);

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ msg: "User registered successfully", token, user });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// LOGIN USER
router.post('/login', async (req, res) => {
  try {
    console.log("🔹 Received Login Request:", req.body);

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid Email:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid Password:", password);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Login Successful:", user);
    res.json({ msg: "Login successful", token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}); 

// router.put('/update-images', authMiddleware, async (req, res) => {
//   try {
//     const { profileImage, bannerImage } = req.body;
//     const user = await User.findById(req.user);

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     if (profileImage) user.profileImage = profileImage;
//     if (bannerImage) user.bannerImage = bannerImage;

//     await user.save();
//     res.json({ msg: "images updated: ", user });
//   } catch (err) {
//     console.error("Error updating image: ", err);
//     res.status(500).json({ msg: "server error" });
//   }
// });


// ✅ Configure multer for file storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// router.put('/update-images', authMiddleware, upload.single('image'), async (req, res) => {
//   try {
//     const user = await User.findById(req.user);
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     if (req.file) {
//       const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
//       user.profileImage = imageUrl; // ✅ Store image URL in DB
//       await user.save();
//       return res.json({ msg: "Image updated successfully", user });
//     }

//     res.status(400).json({ msg: "No image provided" });
//   } catch (err) {
//     console.error("❌ Error updating image:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// ✅ Accept both "profileImage" and "bannerImage"
router.put('/update-images', authMiddleware, upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (req.files.profileImage) {
      user.profileImage = `http://localhost:5000/uploads/${req.files.profileImage[0].filename}`;
    }
    if (req.files.bannerImage) {
      user.bannerImage = `http://localhost:5000/uploads/${req.files.bannerImage[0].filename}`;
    }

    await user.save();
    return res.json({ msg: "Images updated successfully", user });
  } catch (err) {
    console.error("❌ Error updating image:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('name email profileImage bannerImage description');
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put('/update-description', authMiddleware, async (req, res) => {
  try {
    const { description } = req.body;
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.description = description;
    await user.save();
    res.json({ msg: "Description updated successfully", description: user.description });
  } catch (err) {
    console.error("Error updating description:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;

