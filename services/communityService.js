import api from '../config/api';

export const communityService = {
  // Get or create profile
  async getProfile() {
    return await api.get('/community/profile');
  },

  // Update profile
  async updateProfile(bio, skills, interests) {
    return await api.put('/community/profile', { bio, skills, interests });
  },

  // Add achievement
  async addAchievement(achievement) {
    return await api.post('/community/achievements', achievement);
  },

  // Send connection request
  async sendConnectionRequest(connectedUserId) {
    return await api.post('/community/connections/request', { connectedUserId });
  },

  // Accept/reject connection
  async updateConnection(connectionId, status) {
    return await api.put(`/community/connections/${connectionId}`, { status });
  },

  // Create post
  async createPost(content, type, images) {
    return await api.post('/community/posts', { content, type, images });
  },

  // Get all posts (feed)
  async getPosts() {
    return await api.get('/community/posts');
  },

  // Like post
  async likePost(postId) {
    return await api.post(`/community/posts/${postId}/like`);
  },

  // Comment on post
  async commentOnPost(postId, text) {
    return await api.post(`/community/posts/${postId}/comment`, { text });
  },
};

