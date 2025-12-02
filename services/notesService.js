import api from '../config/api';

export const notesService = {
  // Upload note (for teachers)
  async uploadNote(title, subject, fileUrl, filePath) {
    return await api.post('/notes', {
      title,
      subject,
      fileUrl,
      filePath,
    });
  },

  // Get all notes (for students and teachers)
  async getAllNotes() {
    return await api.get('/notes');
  },

  // Get my notes (for teachers)
  async getMyNotes() {
    return await api.get('/notes/my');
  },
};
