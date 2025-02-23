const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 加载环境变量
dotenv.config();

const app = express();

// 基本中间件
app.use(express.json());
app.use(cors());

// 测试路由
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// 数据库连接
let isConnected = false;

const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();
    console.log('MongoDB connected');
    isConnected = true;

    // API 路由
    if (isConnected) {
      app.use('/api/auth', require('./routes/authRoutes'));
      app.use('/api/items', require('./routes/itemRoutes'));
    }

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

startServer();

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

module.exports = app;
