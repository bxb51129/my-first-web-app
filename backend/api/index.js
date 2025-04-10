const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 基本中间件
app.use(express.json());

// 简单的 CORS 配置
app.use(cors());

// API 路由
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/items', require('../routes/itemRoutes'));

// 数据库连接
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      ssl: true,
      authSource: 'admin',
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // 不要退出进程，让应用继续运行
    console.error('Connection failed, but server will continue running');
  }
};

// 初始连接
connectDB();

// 监听连接事件
mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, trying to reconnect...');
  setTimeout(connectDB, 5000);
});

module.exports = app; 