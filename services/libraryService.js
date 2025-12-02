import api from '../config/api';

export const libraryService = {
  // Get all books
  async getAllBooks() {
    return await api.get('/library/books');
  },

  // Request a book (for students)
  async requestBook(bookId, bookName) {
    return await api.post('/library/request', { bookId, bookName });
  },

  // Get my requests (for students)
  async getMyRequests() {
    return await api.get('/library/my-requests');
  },

  // Get all requests (for admin)
  async getAllRequests() {
    return await api.get('/library/requests');
  },

  // Update request status (for admin)
  async updateRequestStatus(requestId, status, issuedDate, returnDate) {
    return await api.put(`/library/requests/${requestId}`, {
      status,
      issuedDate,
      returnDate,
    });
  },
};
