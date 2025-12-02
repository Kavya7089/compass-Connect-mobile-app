import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Priority for base URL:
// 1. EXPO_PUBLIC_API_URL (set via env or expo app config)
// 2. REACT_NATIVE_API_URL (alternate env)
// 3. Default localhost (with android emulator fix)

let API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_NATIVE_API_URL || 'http://localhost:5000/api';

// Android emulator cannot reach host's localhost. Use 10.0.2.2 for Android emulator (default Android emulator),
// 10.0.3.2 is used by Genymotion (not auto-detected).
if (Platform.OS === 'android' && (!process.env.EXPO_PUBLIC_API_URL && !process.env.REACT_NATIVE_API_URL)) {
  // replace only hostname portion if it contains localhost
  API_BASE_URL = API_BASE_URL.replace('localhost', '10.0.2.2');
}

console.log('Using API base URL:', API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getToken() {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async setToken(token) {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  async removeToken() {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  async request(endpoint, options = {}) {
    const token = await this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(' API Request:', { method: options.method || 'GET', url });

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = text;
      }

      console.log(' API Response:', { status: response.status, data });

      if (!response.ok) {
        const errorMsg = data && (data.error || data.message) ? (data.error || data.message) : 'Request failed';
        console.error(' API Error:', errorMsg);
        return { data: null, error: { message: errorMsg } };
      }

      return { data: data.data || data, error: null };
    } catch (error) {
      console.error(' Network Error:', error.message || error);
      return { data: null, error: { message: error.message || 'Network error' } };
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiService();
export default api;
export { api };
