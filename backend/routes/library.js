const express = require('express');
const Book = require('../models/Book');
const LibraryRequest = require('../models/LibraryRequest');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all books
router.get('/books', authMiddleware, async (req, res) => {
  try {
    const books = await Book.find().sort({ bookName: 1 });
    res.json({ data: books, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request book (student)
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { bookId, bookName } = req.body;

    if (!bookName) {
      return res.status(400).json({ error: 'Book name is required' });
    }

    const request = new LibraryRequest({
      studentId: req.user._id,
      bookId: bookId || null,
      bookName,
    });

    await request.save();
    await request.populate('studentId', 'name email department');
    if (request.bookId) {
      await request.populate('bookId');
    }

    res.status(201).json({ data: request, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my requests (student)
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    const requests = await LibraryRequest.find({ studentId: req.user._id })
      .populate('bookId')
      .sort({ createdAt: -1 });

    res.json({ data: requests, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all requests (admin)
router.get('/requests', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const requests = await LibraryRequest.find()
      .populate('studentId', 'name email department')
      .populate('bookId')
      .sort({ createdAt: -1 });

    res.json({ data: requests, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update request status (admin)
router.put('/requests/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { status, issuedDate, returnDate } = req.body;

    const request = await LibraryRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = status || request.status;
    if (issuedDate) request.issuedDate = new Date(issuedDate);
    if (returnDate) request.returnDate = new Date(returnDate);

    await request.save();
    await request.populate('studentId', 'name email department');
    await request.populate('bookId');

    res.json({ data: request, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

