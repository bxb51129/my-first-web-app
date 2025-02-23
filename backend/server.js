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

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// 数据库连接测试
app.get('/db-status', async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    const status = mongoose.connection.readyState;
    res.json({
      status: status === 1 ? 'connected' : 'disconnected',
      uri_exists: !!process.env.MONGODB_URI
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

module.exports = app;
