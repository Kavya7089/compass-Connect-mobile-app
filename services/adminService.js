import api from '../config/api';

export const adminService = {
  // Get all users
  async getAllUsers() {
    return await api.get('/admin/users');
  },

  // Approve a user
  async approveUser(userId, isApproved) {
    return await api.put(`/admin/users/${userId}/approve`, { isApproved });
  },

  // Get all library requests
  async getAllLibraryRequests() {
    return await api.get('/admin/library-requests');
  },

  // Update library request status
  async updateLibraryRequest(requestId, status, issuedDate, returnDate) {
    return await api.put(`/library/requests/${requestId}`, {
      status,
      issuedDate,
      returnDate,
    });
  },

  // Add book
  async addBook(bookName, author, isbn, totalCopies, availableCopies) {
    return await api.post('/admin/books', {
      bookName,
      author,
      isbn,
      totalCopies,
      availableCopies,
    });
  },

  // Get all books
  async getAllBooks() {
    return await api.get('/admin/books');
  },

  // Update book
  async updateBook(bookId, updates) {
    return await api.put(`/admin/books/${bookId}`, updates);
  },
};
