const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../server/models/User'); //  Import User Model
const authMiddleware = require('../middleware/authMiddleware');
const multer = require("multer");
const path = require("path");
require('dotenv').config(); //  Load .env file
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// REGISTER USER
router.post('/register', async (req, res) => {
  try {
    console.log("Received Register Request:", req.body);

    const { name, email, password } = req.body;

    // check if MongoDB is ready
    if (!User.db.readyState) {
      console.error(" Database not connected!");
      return res.status(500).json({ msg: "Database not connected" });
    }

    // check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists:", email);
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  create new user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log("User Registered Successfully:", user);

    // generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ msg: "User registered successfully", token, user });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// LOGIN USER - authenticate user and return token
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

    // generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Login Successful:", user);
    res.json({ msg: "Login successful", token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
}); 

// MULTER: Configure multer for file storage (banner and profile imgs)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// UPDATE IMG: accept both "profileImage" and "bannerImage"
router.put('/update-images', authMiddleware, upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (req.files.profileImage) {
      user.profileImage = `${BASE_URL}/uploads/${req.files.profileImage[0].filename}`;
    }
    if (req.files.bannerImage) {
      user.bannerImage = `${BASE_URL}/uploads/${req.files.bannerImage[0].filename}`; //old with hardcoded localhost:5000
    }

    await user.save();
    return res.json({ msg: "Images updated successfully", user });
  } catch (err) {
    console.error("❌ Error updating image:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// get current profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('name email profileImage bannerImage description following');
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

//update description
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


// get all users except logged in user
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('_id name profileImage bannerImage followers');

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// follow user
router.put('/follow/:id', authMiddleware, async (req, res) => {
  const targetId = req.params.id;
  const currentId = req.user.id;

  if (targetId === currentId) return res.status(400).json({ msg: "You can't follow yourself" });

  try {
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: currentId } });
    await User.findByIdAndUpdate(currentId, { $addToSet: { following: targetId } });
    res.json({ msg: 'Followed' });
  } catch (err) {
    res.status(500).json({ msg: 'Follow failed' });
  }
});

// unfollow user
router.put('/unfollow/:id', authMiddleware, async (req, res) => {
  const targetId = req.params.id;
  const currentId = req.user.id;

  try {
    await User.findByIdAndUpdate(targetId, { $pull: { followers: currentId } });
    await User.findByIdAndUpdate(currentId, { $pull: { following: targetId } });
    res.json({ msg: 'Unfollowed' });
  } catch (err) {
    res.status(500).json({ msg: 'Unfollow failed' });
  }
});

//get public profile
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    const viewedUser = await User.findById(req.params.id)
      .populate('followers')  // ensure data is populated
      .populate('following')  
      .select('_id name profileImage bannerImage description followers following');

    if (!viewedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isFollowing = viewedUser.followers.some(
      follower => follower._id.toString() === req.user.id
    );

    res.json({
      _id: viewedUser._id,
      name: viewedUser.name,
      profileImage: viewedUser.profileImage,
      bannerImage: viewedUser.bannerImage,
      description: viewedUser.description,
      followersCount: viewedUser.followers.length,
      followingCount: viewedUser.following.length,
      isFollowing,
    });
  } catch (err) {
    console.error("Failed to load user profile:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;