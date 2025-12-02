const express = require('express');
const Community = require('../models/Community');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get or create community profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    let community = await Community.findOne({ userId: req.user._id });

    if (!community) {
      community = new Community({ userId: req.user._id });
      await community.save();
    }

    await community.populate('userId', 'name email department role');
    res.json({ data: community, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    let community = await Community.findOne({ userId: req.user._id });

    if (!community) {
      community = new Community({ userId: req.user._id });
    }

    const { bio, skills, interests } = req.body;
    if (bio !== undefined) community.bio = bio;
    if (skills) community.skills = skills;
    if (interests) community.interests = interests;

    await community.save();
    await community.populate('userId', 'name email department role');

    res.json({ data: community, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add achievement
router.post('/achievements', authMiddleware, async (req, res) => {
  try {
    let community = await Community.findOne({ userId: req.user._id });

    if (!community) {
      community = new Community({ userId: req.user._id });
    }

    community.achievements.push(req.body);
    await community.save();

    res.status(201).json({ data: community, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send connection request
router.post('/connections/request', authMiddleware, async (req, res) => {
  try {
    const { connectedUserId } = req.body;

    let community = await Community.findOne({ userId: req.user._id });
    if (!community) {
      community = new Community({ userId: req.user._id });
    }

    // Check if connection already exists
    const existing = community.connections.find(
      c => c.connectedUserId.toString() === connectedUserId
    );

    if (existing) {
      return res.status(400).json({ error: 'Connection request already exists' });
    }

    community.connections.push({
      userId: req.user._id,
      connectedUserId,
      status: 'pending',
    });

    await community.save();
    res.status(201).json({ data: community, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept/reject connection
router.put('/connections/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const community = await Community.findOne({ userId: req.user._id });

    if (!community) {
      return res.status(404).json({ error: 'Community profile not found' });
    }

    const connection = community.connections.id(req.params.id);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    connection.status = status;
    await community.save();

    res.json({ data: community, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    let community = await Community.findOne({ userId: req.user._id });

    if (!community) {
      community = new Community({ userId: req.user._id });
    }

    const post = {
      userId: req.user._id,
      content: req.body.content,
      type: req.body.type || 'general',
      images: req.body.images || [],
      department: req.user.department,
    };

    community.posts.push(post);
    await community.save();

    await community.populate('posts.userId', 'name email department role');

    res.status(201).json({ data: community.posts[community.posts.length - 1], error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts (feed)
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('userId', 'name email department role')
      .populate('posts.userId', 'name email department role')
      .sort({ 'posts.createdAt': -1 });

    const allPosts = [];
    communities.forEach(community => {
      community.posts.forEach(post => {
        allPosts.push({
          ...post.toObject(),
          author: post.userId,
        });
      });
    });

    allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ data: allPosts, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like post
router.post('/posts/:postId/like', authMiddleware, async (req, res) => {
  try {
    const communities = await Community.find();
    let postFound = false;

    for (const community of communities) {
      const post = community.posts.id(req.params.postId);
      if (post) {
        const alreadyLiked = post.likes.some(
          like => like.toString() === req.user._id.toString()
        );

        if (alreadyLiked) {
          post.likes = post.likes.filter(
            like => like.toString() !== req.user._id.toString()
          );
        } else {
          post.likes.push(req.user._id);
        }

        await community.save();
        postFound = true;
        res.json({ data: post, error: null });
        break;
      }
    }

    if (!postFound) {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment on post
router.post('/posts/:postId/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const communities = await Community.find();
    let postFound = false;

    for (const community of communities) {
      const post = community.posts.id(req.params.postId);
      if (post) {
        post.comments.push({
          userId: req.user._id,
          text,
        });
        await community.save();
        await community.populate('posts.comments.userId', 'name email');
        postFound = true;
        res.json({ data: post, error: null });
        break;
      }
    }

    if (!postFound) {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

