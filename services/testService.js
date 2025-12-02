import api from '../config/api';

export const testService = {
  // Get all tests (for students)
  async getAllTests() {
    return await api.get('/tests');
  },

  // Create a test (for teachers)
  async createTest(title, subject, totalMarks, questions, startDate, endDate) {
    return await api.post('/tests', {
      title,
      subject,
      totalMarks,
      questions,
      startDate,
      endDate,
    });
  },

  // Get test with questions
  async getTestWithQuestions(testId) {
    return await api.get(`/tests/${testId}`);
  },

  // Submit test result
  async submitTestResult(testId, answers) {
    return await api.post(`/tests/${testId}/submit`, { answers });
  },

  // Get all test results (for students - their own)
  async getAllTestResults() {
    return await api.get('/tests/results/my');
  },

  // Get test results for teacher
  async getTeacherTestResults() {
    return await api.get('/tests/results/teacher');
  },

  // Get test by ID
  async getTestById(testId) {
    return await api.get(`/tests/${testId}`);
  },
};
