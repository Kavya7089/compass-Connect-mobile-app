import api from '../config/api';

export const eventService = {
  // Get all events
  getEvents: async () => {
    try {
      const response = await api.get('/events');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Get single event
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching event:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Create event (teachers/admins)
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Register for event
  registerEvent: async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/register`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error registering for event:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Unregister from event
  unregisterEvent: async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/unregister`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error unregistering from event:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, data: null, error: error.message };
    }
  },
};
