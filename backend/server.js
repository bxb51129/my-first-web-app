const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// 基本中间件
app.use(express.json());
app.use(cors());

// 请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 连接数据库
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// 数据库状态
app.get('/db-status', async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    // 如果未连接，尝试连接
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    res.json({
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uri_exists: true,
      uri_value: process.env.MONGODB_URI.substring(0, 20) + '...'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: error.message,
      uri_exists: !!process.env.MONGODB_URI
    });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// 初始化连接
connectDB().catch(console.error);

module.exports = app;
