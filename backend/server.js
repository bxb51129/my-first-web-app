const express = require('express');
const cors = require('cors');

const app = express();

// 基本中间件
app.use(express.json());
app.use(cors());

// 请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 根路由
app.get('/', async (req, res) => {
  try {
    res.status(200).json({ message: 'Hello from the API!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 测试路由
app.get('/hello', async (req, res) => {
  try {
    res.status(200).json({ message: 'Hello World!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// 导出 app
module.exports = app;
