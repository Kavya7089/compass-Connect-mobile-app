const express = require('express');
const Note = require('../models/Note');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Upload note (teacher)
router.post('/', authMiddleware, roleMiddleware('teacher'), async (req, res) => {
  try {
    const { title, subject, fileUrl, filePath } = req.body;

    if (!title || !subject || !fileUrl) {
      return res.status(400).json({ error: 'Title, subject, and file URL are required' });
    }

    const note = new Note({
      teacherId: req.user._id,
      title,
      subject,
      fileUrl,
      filePath,
    });

    await note.save();
    await note.populate('teacherId', 'name email');

    res.status(201).json({ data: note, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all notes (students and teachers)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find()
      .populate('teacherId', 'name email department')
      .sort({ createdAt: -1 });

    res.json({ data: notes, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my notes (teacher)
router.get('/my', authMiddleware, roleMiddleware('teacher'), async (req, res) => {
  try {
    const notes = await Note.find({ teacherId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ data: notes, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

