import api from '../config/api';

export const doubtService = {
  // Submit a doubt (for students)
  async submitDoubt(message) {
    return await api.post('/doubts', { message });
  },

  // Get my doubts (for students)
  async getMyDoubts() {
    return await api.get('/doubts/my');
  },

  // Get all doubts (for teachers)
  async getAllDoubts() {
    return await api.get('/doubts/all');
  },

  // Reply to a doubt (for teachers)
  async replyToDoubt(doubtId, reply) {
    return await api.put(`/doubts/${doubtId}/reply`, { reply });
  },
};
