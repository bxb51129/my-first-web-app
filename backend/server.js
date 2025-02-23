const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

// 创建 Express 应用
const app = express();

// 错误处理函数
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// 基本中间件
app.use(express.json());
app.use(cors({
  origin: ['https://my-first-web-app-sigma.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', DELETE, 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 预检请求处理
app.options('*', cors());

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 初始化数据库连接
let dbConnection = null;
const initializeDB = async () => {
  try {
    dbConnection = await connectDB();
    if (!dbConnection) {
      throw new Error('Failed to connect to database');
    }
    console.log('Database connection established');
  } catch (error) {
    console.error('Database initialization failed:', error);
    // 不要退出进程，让应用继续运行
  }
};

// 启动数据库连接
initializeDB();

// API 路由
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// 错误处理中间件
app.use(errorHandler);

// 导出 app 实例
module.exports = app;
