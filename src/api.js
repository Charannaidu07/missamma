import axios from "axios";

const BASE_URL = "https://missamma.centralindia.cloudapp.azure.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Improved token handling
export const getToken = () => {
  // Try all possible token locations
  const token = localStorage.getItem('access_token') || 
                localStorage.getItem('access') || 
                localStorage.getItem('token') ||
                sessionStorage.getItem('access_token') ||
                sessionStorage.getItem('access');
  
  if (!token) {
    console.warn('🔍 No token found in storage');
    return null;
  }
  
  // Clean the token - remove quotes, whitespace
  let cleanToken = token.replace(/^["'\s]+|["'\s]+$/g, '');
  
  // Check if token is valid JWT format
  const parts = cleanToken.split('.');
  if (parts.length !== 3) {
    console.error('❌ Invalid token format - not a JWT');
    // Try to extract token from string (might be wrapped in JSON)
    const tokenMatch = token.match(/"access_token"\s*:\s*"([^"]+)"/);
    if (tokenMatch && tokenMatch[1]) {
      cleanToken = tokenMatch[1];
      console.log('🔄 Extracted token from JSON string');
    } else {
      return null;
    }
  }
  
  console.log('✅ Token retrieved, length:', cleanToken.length);
  console.log('✅ Token sample:', cleanToken.substring(0, 30) + '...');
  return cleanToken;
};

export const checkAuth = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const isExpired = Date.now() >= payload.exp * 1000;
    
    if (isExpired) {
      console.warn('⚠️ Token expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error checking token:', error);
    return false;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🔍 [API Request]', config.method?.toUpperCase(), config.url);
    
    const token = getToken();
    
    if (token) {
      // Verify it's a valid JWT before sending
      const parts = token.split('.');
      if (parts.length === 3) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('✅ Token added to request');
      } else {
        console.error('❌ Invalid token format, not adding to request');
      }
    } else {
      console.warn('⚠️ No valid token available for request');
    }
    
    // Log request data for debugging (except passwords)
    if (config.data && config.url !== '/accounts/login/') {
      try {
        const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        console.log('📦 Request data:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('📦 Request data (raw):', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', {
      status: response.status,
      url: response.config.url,
    });
    
    // Check if response contains new tokens
    if (response.data?.access) {
      console.log('🔄 New access token received, updating storage');
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('access', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    
    // Log response data if available
    if (error.response?.data) {
      console.error('❌ Error response:', error.response.data);
    }
    
    // Handle 401 - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔄 Attempting token refresh...');
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(`${BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          const newAccessToken = refreshResponse.data.access;
          console.log('✅ Token refreshed successfully');
          
          // Store new tokens
          localStorage.setItem('access_token', newAccessToken);
          localStorage.setItem('access', newAccessToken);
          
          // Retry original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
          
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
        }
      }
      
      // If refresh failed or no refresh token, clear everything
      console.log('🧹 Clearing all auth data');
      localStorage.removeItem('access_token');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user_info');
      sessionStorage.clear();
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        const currentPath = window.location.pathname + window.location.search;
        alert('Your session has expired. Please login again.');
        window.location.href = `/login?from=${encodeURIComponent(currentPath)}`;
      }
    }
    
    // Handle 500 errors
    if (error.response?.status === 500) {
      console.error('🔥 Server 500 Error - Backend issue');
    }
    
    return Promise.reject(error);
  }
);

export default api;