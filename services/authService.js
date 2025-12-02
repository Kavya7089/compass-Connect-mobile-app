import api from '../config/api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  // Sign up with role
  async signUp(email, password, role = 'student', name, department) {
    try {
      const { data, error } = await api.post('/auth/signup', {
        email,
        password,
        role,
        name,
        department,
      });

      if (error) {
        console.error('❌ Signup error:', error);
        return { data: null, error };
      }

      if (data && data.token) {
        await api.setToken(data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));
        console.log('✅ Signup successful');
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ Signup exception:', error);
      return { data: null, error: { message: error.message || 'Signup failed' } };
    }
  },

  // Sign in
  async signIn(email, password) {
    try {
      const { data, error } = await api.post('/auth/signin', {
        email,
        password,
      });

      if (error) {
        console.error('❌ SignIn error:', error);
        return { data: null, error };
      }

      if (data && data.token) {
        await api.setToken(data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));
        console.log('✅ SignIn successful');
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ SignIn exception:', error);
      return { data: null, error: { message: error.message || 'SignIn failed' } };
    }
  },

  // Sign out
  async signOut() {
    await api.removeToken();
    await SecureStore.deleteItemAsync('user');
    return { error: null };
  },

  // Get current user
  async getCurrentUser() {
    try {
      const userStr = await SecureStore.getItemAsync('user');
      if (userStr) {
        return JSON.parse(userStr);
      }

      // Try to get from API
      const { data, error } = await api.get('/auth/me');
      if (data) {
        await SecureStore.setItemAsync('user', JSON.stringify(data));
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    return await api.get(`/users/${userId}`);
  },

  // Check if user is approved
  async isUserApproved(userId) {
    return true; // Auto-approved for now
  },

  // Listen to auth state changes (simplified for API)
  onAuthStateChange(callback) {
    // For API-based auth, we'll check periodically or on app focus
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },
};
