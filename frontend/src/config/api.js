const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://my-first-web-app-nwlr.vercel.app/api'
  : 'http://localhost:5001/api';

// 添加调试日志
console.log('API URL:', API_URL);
console.log('Environment:', process.env.NODE_ENV);

export default API_URL; 