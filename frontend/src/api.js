import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

// 请求拦截器：附加 Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 响应拦截器：统一错误处理
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default API;
