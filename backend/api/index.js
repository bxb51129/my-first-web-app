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
  // 设置 CORS 头
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// API 路由
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/items', require('../routes/itemRoutes'));

// 数据库连接
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      authSource: 'admin'
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // 打印连接字符串（隐藏密码）
    const sanitizedUri = process.env.MONGODB_URI.replace(
      /(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/,
      '$1****$3'
    );
    console.error('Connection string:', sanitizedUri);
  }
};

connectDB();

module.exports = app; 