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

// API 路由前缀
app.use('/api', (req, res, next) => {
  console.log('API request:', req.method, req.path);
  next();
});

// API 路由
app.use('/api/auth', require('./routes/authRoutes'));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// 404 处理
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path 
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message });
});

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

module.exports = app;
