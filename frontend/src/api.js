import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// AUTOMATED INTERCEPTOR: With bypass controls for public routes
api.interceptors.request.use(
  (config) => {
    // 🚪 BYPASS CHECK: If logging in or signing up, do NOT attach a token header
    if (config.url.includes('/login') || config.url.includes('/register')) {
      return config;
    }

    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;