const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selectedOptionId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const testResultSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scoreObtained: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  answers: [answerSchema],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TestResult', testResultSchema);

