import api from '../config/api';

export const notificationService = {
  // Get all notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/count');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return { success: false, data: { unreadCount: 0 }, error: error.message };
    }
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error marking as read:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/mark-all-read');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Create announcement
  createAnnouncement: async (announcementData) => {
    try {
      const response = await api.post('/notifications/announce', announcementData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating announcement:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, data: null, error: error.message };
    }
  },
};
