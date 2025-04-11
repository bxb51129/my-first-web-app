const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 基本中间件
app.use(express.json());

// CORS 配置
app.use(cors({
  origin: true,  // 允许所有来源
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false  // 禁用 credentials
}));

// API 路由
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/items', require('../routes/itemRoutes'));

// 数据库连接
const connectDB = async () => {
  const retryConnect = async (retries = 5, delay = 5000) => {
    try {
      console.log('Attempting to connect to MongoDB...');
      console.log('Connection string:', process.env.MONGODB_URI.replace(
        /(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/,
        '$1****$3'
      ));

      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        retryWrites: true,
        w: 'majority'
      });

      console.log('MongoDB connected successfully');
      
      // 测试连接
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      
    } catch (error) {
      console.error('MongoDB connection error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        codeName: error.codeName
      });

      if (retries > 0) {
        console.log(`Retrying connection in ${delay/1000} seconds... (${retries} attempts remaining)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryConnect(retries - 1, delay);
      }
      throw error;
    }
  };

  await retryConnect();
};

connectDB();

module.exports = app; 