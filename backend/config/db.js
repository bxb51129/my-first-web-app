const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri;
    
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      // 使用内存数据库
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('Using in-memory database:', uri);
    } else {
      // 使用环境变量中的 MongoDB URI
      uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }
    }

    await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully');
    
    // 添加连接错误处理
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
