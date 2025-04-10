const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 基本中间件
app.use(express.json());

// CORS 配置
const corsOptions = {
  origin: 'https://my-first-web-app-sigma.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};

// 应用 CORS
app.use(cors(corsOptions));

// 确保 CORS 头部被设置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://my-first-web-app-sigma.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// 处理 OPTIONS 请求
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://my-first-web-app-sigma.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

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
    console.error('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
  }
};

connectDB();

module.exports = app; 