const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// 基本中间件
app.use(express.json());
app.use(cors());

// 请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 连接数据库
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    // 监听连接事件
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    // 尝试连接
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 秒超时
      socketTimeoutMS: 45000, // 45 秒超时
    });

    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// 数据库状态
app.get('/db-status', async (req, res) => {
  try {
    console.log('Checking database status...');
    console.log('Current connection state:', mongoose.connection.readyState);
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    // 如果未连接，尝试连接
    if (mongoose.connection.readyState !== 1) {
      console.log('Connection not established, attempting to connect...');
      await connectDB();
    }
    
    const connectionState = mongoose.connection.readyState;
    console.log('Final connection state:', connectionState);
    
    res.json({
      status: connectionState === 1 ? 'connected' : 'disconnected',
      state: connectionState,
      uri_exists: true,
      uri_preview: process.env.MONGODB_URI.substring(0, 20) + '...'
    });
  } catch (error) {
    console.error('Database status check error:', error);
    res.status(500).json({ 
      error: error.message,
      uri_exists: !!process.env.MONGODB_URI,
      stack: error.stack
    });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 初始化连接
console.log('Starting server...');
connectDB().catch(err => {
  console.error('Initial connection failed:', err);
});

module.exports = app;
