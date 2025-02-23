const app = require('../server');

// 导出处理函数
module.exports = (req, res) => {
  console.log('Request received:', req.method, req.url);
  return app(req, res);
}; 