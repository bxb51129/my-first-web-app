const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// CORS 配置
const corsOptions = {
  origin: 'https://my-first-web-app-sigma.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// 基本中间件
app.use(express.json());
app.use(cors(corsOptions));

// 预检请求处理
app.options('*', cors(corsOptions));

// 请求日志
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// 测试路由
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working' });
});

// API 路由
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

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
  res.status(500).json({ error: err.message });
});

// 连接数据库
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

module.exports = app;
