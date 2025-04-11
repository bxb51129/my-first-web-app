const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// 环境变量日志
console.log('\n🔧 Environment variables:');
console.log('🧪 MONGO_URI:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(
  /(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/,
  '$1****$3'
) : '❌ undefined');
console.log('🌍 NODE_ENV:', process.env.NODE_ENV || '❌ undefined');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ [HIDDEN]' : '❌ undefined');

const app = express();

// 基本中间件
app.use(express.json());

// CORS 配置
app.use(cors({
  origin: 'https://my-first-web-app-sigma.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 全局 CORS 中间件
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://my-first-web-app-sigma.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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

// 数据库连接
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'test',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      authSource: 'admin'
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed');
    console.error('🔍 Error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    // 不要立即退出，让应用继续运行
    // process.exit(1);
  }
};

// 连接数据库
connectDB().catch(console.error);

module.exports = app; 