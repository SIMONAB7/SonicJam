const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const multer = require('multer');
const Video = require('../server/models/Video');
const User = require('../server/models/User'); // import user model

const router = express.Router();

// ensure uploads/videos exists for storing videos
const uploadDir = 'uploads/videos';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// get all videos from database
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('user', 'name profileImage');
    res.json(videos);
  } catch (err) {
    console.error('Failed to fetch videos:', err);
    res.status(500).json({ message: 'Server error fetching videos.' });
  }
});

// upload new video woth metadata and file upload
router.post('/', authMiddleware, upload.single('videoFile'), async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title,
      artist: req.body.artist,
      songName: req.body.songName,
      tuning: req.body.tuning,
      description: req.body.description,
      type: req.body.type,
      isAnonymous: req.body.isAnonymous === 'true', //stored as boolean
      url: `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/videos/${req.file.filename}`,
      user: req.user.id,
    });

    await video.save();
    res.status(201).json(video);
  } catch (err) {
    console.error('Failed to upload video:', err);
    res.status(500).json({ message: 'Server error uploading video.' });
  }
});

// Delete a video by ID only if it belongs to the requesting user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    if (video.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized to delete this video.' });
  
    await video.deleteOne();
    res.json({ message: 'Video deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete video:', err);
    res.status(500).json({ message: 'Server error deleting video.' });
  }
});

module.exports = router;
