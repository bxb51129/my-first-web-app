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

// 在文件顶部添加环境变量日志
console.log('Environment variables:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[HIDDEN]' : 'undefined');

// 数据库连接
const connectDB = async () => {
  try {
    // 获取连接字符串
    const uri = process.env.MONGO_URI;
    console.log('Attempting to connect with URI:', uri ? uri.replace(
      /(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/,
      '$1****$3'
    ) : 'undefined');

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
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    process.exit(1);
  }
};

connectDB().catch(console.error);

module.exports = app; 