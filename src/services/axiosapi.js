import axios from 'axios';
import { API_URL } from '../helper';

// Axios instance create karein
const axiosInstance = axios.create({
  baseURL: API_URL||"http://localhost:5173",
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (optional - agar auth token add karna ho)
axiosInstance.interceptors.request.use(
  (config) => {
    // Agar token local storage mein ho to add karein
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional - error handling ke liye)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.log('Unauthorized access');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;