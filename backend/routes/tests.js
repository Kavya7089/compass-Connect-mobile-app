const express = require('express');
const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all tests (for students)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ data: tests, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get test with questions
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json({ data: test, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create test (teacher only)
router.post('/', authMiddleware, roleMiddleware('teacher'), async (req, res) => {
  try {
    const { title, subject, totalMarks, questions, startDate, endDate } = req.body;

    const test = new Test({
      title,
      subject,
      totalMarks,
      questions,
      createdBy: req.user._id,
      startDate: startDate || new Date(),
      endDate,
    });

    await test.save();
    await test.populate('createdBy', 'name email');

    res.status(201).json({ data: test, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit test result
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Calculate score
    let correctCount = 0;
    let obtainedMarks = 0;

    const processedAnswers = test.questions.map((question) => {
      const answer = answers.find(a => a.questionId.toString() === question._id.toString());
      const selectedOption = answer
        ? question.options.find(opt => opt._id.toString() === answer.selectedOptionId)
        : null;

      const isCorrect = selectedOption ? selectedOption.isCorrect : false;

      if (isCorrect) {
        correctCount++;
        obtainedMarks += question.marks || 1;
      }

      return {
        questionId: question._id,
        selectedOptionId: answer?.selectedOptionId || null,
        isCorrect,
      };
    });

    const percentage = (obtainedMarks / test.totalMarks) * 100;

    const result = new TestResult({
      testId: test._id,
      studentId: req.user._id,
      scoreObtained: obtainedMarks,
      totalMarks: test.totalMarks,
      percentage: percentage.toFixed(2),
      answers: processedAnswers,
    });

    await result.save();

    res.json({
      data: {
        result,
        score: {
          correctCount,
          totalQuestions: test.questions.length,
          obtainedMarks,
          totalMarks: test.totalMarks,
          percentage: percentage.toFixed(2),
        },
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get test results for student
router.get('/results/my', authMiddleware, async (req, res) => {
  try {
    const results = await TestResult.find({ studentId: req.user._id })
      .populate('testId', 'title subject totalMarks')
      .sort({ submittedAt: -1 });

    res.json({ data: results, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get test results for teacher (their tests)
router.get('/results/teacher', authMiddleware, roleMiddleware('teacher'), async (req, res) => {
  try {
    const tests = await Test.find({ createdBy: req.user._id }).select('_id');
    const testIds = tests.map(t => t._id);

    const results = await TestResult.find({ testId: { $in: testIds } })
      .populate('testId', 'title subject totalMarks')
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({ data: results, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

