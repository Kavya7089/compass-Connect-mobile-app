const mongoose = require('mongoose');

const libraryRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  bookName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'issued', 'returned', 'rejected'],
    default: 'requested',
  },
  issuedDate: {
    type: Date,
  },
  returnDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LibraryRequest', libraryRequestSchema);

