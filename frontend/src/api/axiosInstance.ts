import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Add a request interceptor to handle errors or logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Potentially redirect to login or refresh token
      console.error('Unauthorized! Redirecting...');
    }
    return Promise.reject(error);
  }
);

export default api;
