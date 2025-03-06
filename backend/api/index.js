const app = require('../server');

// 导出处理函数
module.exports = (req, res) => {
  // 添加 CORS 头
  res.setHeader('Access-Control-Allow-Origin', 'https://my-first-web-app-sigma.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 打印请求信息
  console.log('Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });

  return app(req, res);
}; 