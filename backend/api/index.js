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
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'myFirstDatabase'  // 指定数据库名称
})
.then(async () => {
  console.log('MongoDB Connected');
  
  // 检查并创建集合
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  // 如果 users 集合不存在，创建它
  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
    console.log('Users collection created');
  }
  
  // 如果 items 集合不存在，创建它
  if (!collectionNames.includes('items')) {
    await db.createCollection('items');
    console.log('Items collection created');
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Connection string:', process.env.MONGODB_URI.replace(
    /(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/,
    '$1****$3'
  ));
});

module.exports = app; 