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
  origin: process.env.CORS_ORIGIN || true,  // 使用环境变量中的域名，如果没有则自动接受请求的 origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// API 路由
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/items', require('../routes/itemRoutes'));

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