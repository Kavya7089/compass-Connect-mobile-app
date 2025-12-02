const express = require('express');
const Doubt = require('../models/Doubt');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Submit doubt (student)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const doubt = new Doubt({
      studentId: req.user._id,
      message,
    });

    await doubt.save();
    await doubt.populate('studentId', 'name email');

    res.status(201).json({ data: doubt, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my doubts (student)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const doubts = await Doubt.find({ studentId: req.user._id })
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ data: doubts, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all doubts (teacher)
router.get('/all', authMiddleware, roleMiddleware('teacher'), async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate('studentId', 'name email department')
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ data: doubts, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reply to doubt (teacher)
router.put('/:id/reply', authMiddleware, roleMiddleware('teacher'), async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ error: 'Reply is required' });
    }

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ error: 'Doubt not found' });
    }

    doubt.reply = reply;
    doubt.teacherId = req.user._id;
    doubt.repliedAt = new Date();
    doubt.status = 'answered';

    await doubt.save();
    await doubt.populate('studentId', 'name email');
    await doubt.populate('teacherId', 'name email');

    res.json({ data: doubt, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

