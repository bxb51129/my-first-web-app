const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 基本中间件
app.use(express.json());

// CORS 配置
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://my-first-web-app-sigma.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 请求日志
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

// 设置超时
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
});

// API 路由
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/items', require('../routes/itemRoutes'));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// 404 处理
app.use((req, res) => {
  console.log('404:', req.method, req.path);
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
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
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
      authSource: 'admin'
    });

    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // 不要直接退出进程，而是抛出错误
    throw error;
  }
};

// 初始连接
connectDB().catch(err => {
  console.error('Initial connection error:', err);
});

// 监听连接事件
mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, trying to reconnect...');
  connectDB().catch(err => {
    console.error('Reconnection error:', err);
  });
});

// 导出处理函数
module.exports = app; 