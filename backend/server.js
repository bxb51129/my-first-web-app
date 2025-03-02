const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(express.json());

// CORS 配置
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://my-first-web-app-sigma.vercel.app',
      'https://my-first-web-99rwyyyaa-byw1123s-projects.vercel.app',
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 预检请求
app.options('*', cors(corsOptions));

// 请求日志
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});

// 连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

// 监听数据库连接事件
mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  connectDB();
});

// API 路由
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed'
    });
  }
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  console.log('404:', req.method, req.path);
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

module.exports = app;
