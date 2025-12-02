import axios from "axios";

export const api = axios.create({
  baseURL: "http://missamma.centralindia.cloudapp.azure.com/api",
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
  // (config) => {
  //   const token = localStorage.getItem("access");
    
  //   if (token && !isTokenExpired(token)) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //     console.log("✅ Token attached to request");
  //   } else {
  //     console.warn("❌ No valid token available");
  //     delete config.headers.Authorization;
  //     // Remove expired token
  //     if (token) {
  //       localStorage.removeItem("access");
  //       localStorage.removeItem("refresh");
  //     }
  //   }
    (config) => {
    const token = localStorage.getItem("access");
    console.log("🔍 Token from localStorage:", token ? "Exists" : "Missing");
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("🔍 Token payload:", payload);
        console.log("🔍 User ID:", payload.user_id);
        console.log("🔍 Token expiry:", new Date(payload.exp * 1000));
      } catch (e) {
        console.error("🔍 Token decode error:", e);
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
        const response = await axios.post(
  "http://missamma.centralindia.cloudapp.azure.com/api/accounts/token/refresh/",
  { refresh: refreshToken }
);

        
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