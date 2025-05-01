const express = require('express');
const router = express.Router();
const Post = require('../server/models/Post');
const User = require('../server/models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/posts - get posts from followed users + self
router.get('/', authMiddleware, async (req, res) => {
  try {
    // const user = await User.findById(req.user.id);
    // const followingIds = [...user.following, user._id];
    let posts;

      // Handle liked posts via query param
      if (req.query.liked === 'true') {
        posts = await Post.find({ likes: req.user.id })
          .populate('userId', 'name profileImage')
          .sort({ createdAt: -1 });
      } else {
        const user = await User.findById(req.user.id);
        const followingIds = [...user.following, user._id];

    posts = await Post.find({ userId: { $in: followingIds } })
      .populate('userId', 'name profileImage')//populate user info
      .sort({ createdAt: -1 }) //most recent first 
      .limit(50);
    }

    res.json(posts);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    res.status(500).json({ msg: "Failed to fetch posts" });
  }
});

// DELETE /api/posts/:id - delete a post by id
router.delete('/:id', authMiddleware, async (req, res) => {
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

    //detect platform type
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
    console.error("Failed to create post:", err);
    res.status(400).json({ msg: "Failed to create post" });
  }
});

// PUT /api/posts/:id/like - toggle like/unlike a post
router.put('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({ likes: post.likes });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ msg: 'Failed to toggle like' });
  }
});

// GET /api/posts/liked - get posts liked by the current user
router.get('/liked', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ likes: req.user.id })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error('Failed to fetch liked posts:', err);
    res.status(500).json({ msg: 'Error fetching liked posts' });
  }
});

// POST /api/posts/:id/comment - Add comment to post
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Comment is empty' });

    const currentUser = await User.findById(req.user.id).select('name');
    if (!currentUser) return res.status(404).json({ msg: 'User not found' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // store both ID and NAME in the comment
    const newComment = {
      userId: req.user.id,
      userName: currentUser.name,
      text,
      createdAt: new Date()
    };
    
    post.comments.push(newComment);
    await post.save();
    
    // return the comment with all needed data
    res.status(201).json({
      _id: post.comments[post.comments.length - 1]._id,
      text,
      createdAt: new Date(),
      userId: {
        _id: req.user.id,
        name: currentUser.name
      }
    });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ msg: 'Failed to add comment' });
  }
});

module.exports = router;