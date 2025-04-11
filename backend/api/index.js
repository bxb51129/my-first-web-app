const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
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
const connectDB = async () => {
  try {
    // 获取连接字符串
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MongoDB connection string is not defined');
    }

    // 连接 MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB Connected');

    // 创建数据库和集合
    const db = client.db('myFirstDatabase');
    
    // 创建集合
    const collections = ['users', 'items'];
    for (const collection of collections) {
      try {
        await db.createCollection(collection);
        console.log(`${collection} collection created`);
      } catch (err) {
        if (err.code !== 48) { // 48 是集合已存在的错误码
          console.warn(`Warning creating ${collection}:`, err.message);
        }
      }
    }

    // 连接 mongoose
    await mongoose.connect(uri, {
      dbName: 'myFirstDatabase',
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Mongoose connected');

  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

connectDB().catch(console.error);

module.exports = app; 