import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token attached to request");
    } else {
      console.warn("❌ No valid token available");
      delete config.headers.Authorization;
      // Remove expired token
      if (token) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        
        console.log("🔄 Attempting token refresh...");
        const response = await axios.post("http://127.0.0.1:8000/api/accounts/token/refresh/", {
          refresh: refreshToken
        });
        
        const newAccessToken = response.data.access;
        localStorage.setItem("access", newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        // Redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);