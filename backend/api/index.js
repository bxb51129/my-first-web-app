const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 基本中间件
app.use(express.json());

// 简单的 CORS 配置
app.use(cors());

// 路由前缀
const router = express.Router();

// API 路由
router.use('/auth', require('../routes/authRoutes'));
router.use('/items', require('../routes/itemRoutes'));

// 挂载路由到 /api 前缀
app.use('/api', router);

// 根路由处理
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 数据库连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app; 