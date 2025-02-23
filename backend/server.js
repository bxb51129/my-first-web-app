const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

// 创建 Express 应用
const app = express();

// 基本中间件
app.use(express.json());

// CORS 配置
app.use(cors({
  origin: true,  // 允许所有来源
  credentials: false  // 禁用 credentials
}));

// 在路由之前添加请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    body: req.body,
    headers: req.headers
  });
  next();
});

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 初始化数据库
const initDB = async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.log('Warning: Server starting without database connection');
  }
};

// 启动数据库连接但不等待
initDB();

// API 路由
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// 404 处理
app.use((req, res) => {
  console.log('404 Not Found:', req.url);
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

// 导出 app 实例
module.exports = app;
