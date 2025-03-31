const express = require('express');
const router = express.Router();
const Post = require('../server/models/Post');
const User = require('../server/models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/posts - Get posts from followed users + self
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('following');

    // Collect the IDs of followed users + self
    const followingIds = user.following.map(f => f._id.toString());
    followingIds.push(user._id.toString());

    // Fetch posts from those users
    const posts = await Post.find({ userId: { $in: followingIds } })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    console.error("❌ Failed to fetch posts:", err);
    res.status(500).json({ msg: "Failed to fetch posts" });
  }
});

//Detele /api/posts - deletes a post made by the user
router.delete('/:id', async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// POST /api/posts - Share a song link
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { link, description } = req.body;
    if (!link) return res.status(400).json({ msg: "Link is required" });

    let platform = "Link";
    if (link.includes('spotify.com')) platform = 'Spotify';
    else if (link.includes('youtube.com') || link.includes('youtu.be')) platform = 'YouTube';
    else if (link.includes('music.apple.com')) platform = 'Apple Music';

    const newPost = await Post.create({
      userId: req.user.id,
      link,
      platform,
      description
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("❌ Failed to create post:", err);
    res.status(400).json({ msg: "Failed to create post" });
  }
});

module.exports = router;
