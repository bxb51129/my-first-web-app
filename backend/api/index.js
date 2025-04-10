const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 基本中间件
app.use(express.json());

// CORS 配置
app.use(cors({
  origin: [
    'https://my-first-web-app-sigma.vercel.app',
    'https://my-first-web-j0o91a4by-byw1123s-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// 调试中间件
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });

  // 捕获响应
  const oldSend = res.send;
  res.send = function(data) {
    console.log('Response:', {
      status: res.statusCode,
      headers: res._headers,
      body: data
    });
    oldSend.apply(res, arguments);
  };

  next();
});

// API 路由
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/items', require('../routes/itemRoutes'));

// 处理 favicon.ico 请求
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // 返回空响应
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 数据库连接
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectDB();

module.exports = app; 