// Authorization.js
import axios from 'axios';

const baseURL = 'http://localhost:3000'; // Update with your API server URL

const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const clearToken = () => {
  localStorage.removeItem('token');
};

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearToken();
      // Redirect to login page or handle accordingly
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, getToken, setToken, clearToken };
