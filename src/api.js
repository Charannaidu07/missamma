import axios from "axios";

export const api = axios.create({
  baseURL: "https://missamma.centralindia.cloudapp.azure.com/api",
});

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};
// In your api.js file, update the request interceptor:
// In api.js - Update the request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🔍 [API Request] URL:', config.url);
    console.log('🔍 [API Request] Method:', config.method);
    
    const token = localStorage.getItem('access_token');
    
    if (token) {
      console.log('✅ [API Request] Token found, length:', token.length);
      console.log('✅ [API Request] Token first 20 chars:', token.substring(0, 20) + '...');
      
      // Try both JWT and Token authentication headers
      config.headers['Authorization'] = `Bearer ${token}`;
      // Also try Token authentication if JWT isn't working
      config.headers['X-Authorization'] = token;
      
    } else {
      console.warn('⚠️ [API Request] No token found in localStorage');
      console.log('🔍 [API Request] localStorage contents:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`  ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`);
      }
    }
    
    console.log('🔍 [API Request] Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ [API Request] Interceptor error:', error);
    return Promise.reject(error);
  }
);

// Also add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response status:', response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            'https://missamma.centralindia.cloudapp.azure.com/api/token/refresh/',
            { refresh: refreshToken }
          );
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);