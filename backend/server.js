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

// 取消注释数据库连接部分
connectDB().then(async () => {
    console.log('MongoDB connected successfully');
    
    // 测试数据库连接
    try {
        const testUser = await User.findOne({});
        console.log('Database test - Found user:', testUser ? 'Yes' : 'No');
    } catch (error) {
        console.error('Database test failed:', error);
    }
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const app = express();

// CORS 配置
app.use(cors({
  origin: true, // 允许所有来源
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
}));

// 添加一个预检请求的处理
app.options('*', cors());

// 添加一个中间件来设置额外的 CORS 头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  const error = {
    status: err.status || 500,
    message: process.env.NODE_ENV === 'production' 
      ? '服务器错误' 
      : err.message || '服务器错误',
  };
  
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }
  
  res.status(error.status).json({ error });
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
