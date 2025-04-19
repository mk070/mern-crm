// src/api/axios.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Example: 'https://api.yourdomain.com'
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Optional: Request interceptor to attach token from cookies/localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or from cookies if needed
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g. redirect to login)
      console.error('Unauthorized. Redirecting to login...');
      window.location.href = '/login';
    } else {
      console.error('API Error:', error.response || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
