const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const LibraryRequest = require('../models/LibraryRequest');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ data: users, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject user
router.put('/users/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add book
router.post('/books', async (req, res) => {
  try {
    const { bookName, author, isbn, totalCopies, availableCopies } = req.body;

    const book = new Book({
      bookName,
      author,
      isbn,
      totalCopies: totalCopies || 1,
      availableCopies: availableCopies || totalCopies || 1,
    });

    await book.save();
    res.status(201).json({ data: book, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ bookName: 1 });
    res.json({ data: books, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
router.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ data: book, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all library requests
router.get('/library-requests', async (req, res) => {
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

module.exports = router;

