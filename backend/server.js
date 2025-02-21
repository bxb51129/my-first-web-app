const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');  // 添加日志中间件
const compression = require('compression');  // 添加压缩中间件
const mongoSanitize = require('express-mongo-sanitize');  // 防止 MongoDB 注入
const path = require('path');
const User = require('./models/User');

// 确保在其他配置之前加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

// 验证环境变量
console.log('Environment variables loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? '***' : undefined,
  PORT: process.env.PORT
});

// 修改数据库连接部分
connectDB().then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const app = express();

// 修改 CORS 配置
app.use((req, res, next) => {
  // 允许多个域名
  const allowedOrigins = [
    'https://my-first-web-app-sigma.vercel.app',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// 开发环境日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 安全中间件
app.use(helmet());
app.use(compression());  // 启用压缩
app.use(mongoSanitize());  // 防止 MongoDB 注入

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
});
app.use(limiter);

// 在路由之前添加调试中间件
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Path: ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('======================');
  next();
});

// 请求体解析 - 确保在路由之前
app.use(express.json());

// API 路由
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 处理 - 添加更多日志
app.use((req, res) => {
  console.log('=== 404 Error ===');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Path: ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('=================');
  
  res.status(404).json({ 
    error: 'API route not found',
    path: req.url,
    method: req.method
  });
});

// 在文件开头添加 unhandledRejection 处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 修改错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 修改服务器启动部分，添加更多错误处理
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    console.log('=================================');
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});

// 添加优雅关闭
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
