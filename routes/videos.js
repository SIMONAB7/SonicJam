// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();
// const Video = require('../server/models/Video');
// const authMiddleware = require('../middleware/authMiddleware');
// const User = require('../server/models/User'); // import user model
// const fs = require('fs');

// // Multer setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/videos/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });

// router.post('/', authMiddleware, upload.single('videoFile'), async (req, res) => {
//     try {
//       const {
//         title,
//         artist,
//         songName,
//         tuning,
//         description,
//         isAnonymous,
//         type,
//       } = req.body;
  
//       const newVideo = new Video({
//         title,
//         artist,
//         songName,
//         tuning,
//         description,
//         isAnonymous: isAnonymous === 'true',
//         type,
//         url: `/uploads/videos/${req.file.filename}`,
//         user: req.user, // attaches current user ID
//       });
  
//       await newVideo.save();
//       res.status(201).json(newVideo);
//     } catch (err) {
//       console.error('Upload error:', err);
//       res.status(500).json({ error: 'Failed to upload video' });
//     }
//   });
  

//   router.get('/', async (req, res) => {
//     try {
//       const videos = await Video.find()
//         .sort({ createdAt: -1 })
//         .populate('user', '_id name profileImage'); // Pull name + profile image
  
//       res.json(videos);
//     } catch (err) {
//       res.status(500).json({ error: 'Failed to fetch videos' });
//     }
//   });

//   router.delete('/:id', authMiddleware, async (req, res) => {
//     try {
//       const video = await Video.findById(req.params.id);
//       if (!video) return res.status(404).json({ error: 'Video not found' });
  
//       // Check if the current user owns the video
//       if (video.user.toString() !== req.user) {
//         return res.status(403).json({ error: 'Unauthorized' });
//       }
  
//       // Delete video file from disk
//       const filePath = path.join(__dirname, '../uploads', 'videos', path.basename(video.url));
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  
//       // Remove video from DB
//       await Video.findByIdAndDelete(req.params.id);
//       res.json({ message: 'Video deleted successfully' });
//     } catch (err) {
//       console.error('Delete error:', err);
//       res.status(500).json({ error: 'Server error during delete' });
//     }
//   });
  
  
  

// module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../server/models/Video');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Ensure uploads/videos exists
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

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('user', 'name profileImage');
    res.json(videos);
  } catch (err) {
    console.error('Failed to fetch videos:', err);
    res.status(500).json({ message: 'Server error fetching videos.' });
  }
});

// Upload new video
router.post('/', authenticateToken, upload.single('videoFile'), async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title,
      artist: req.body.artist,
      songName: req.body.songName,
      tuning: req.body.tuning,
      description: req.body.description,
      type: req.body.type,
      isAnonymous: req.body.isAnonymous === 'true',
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

// Delete a video
router.delete('/:id', authenticateToken, async (req, res) => {
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
