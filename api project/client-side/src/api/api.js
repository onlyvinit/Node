import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9090/api',  // Make sure the base URL is correct
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Include token in every request
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
