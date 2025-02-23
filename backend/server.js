const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 加载环境变量
dotenv.config();

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
app.get('/', async (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// 测试数据库连接
app.get('/db-test', async (req, res) => {
  try {
    // 尝试连接数据库
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    res.json({ 
      message: 'Database connection successful',
      mongoUri: process.env.MONGODB_URI ? 'MongoDB URI is set' : 'MongoDB URI is not set'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message
    });
  }
});

// 初始化数据库
const initDB = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');
    
    // 数据库连接成功后加载路由
    app.use('/api/auth', require('./routes/authRoutes'));
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// 启动数据库连接
initDB();

// 404 处理
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Server error',
    message: err.message
  });
});

// 导出 app
module.exports = app;
