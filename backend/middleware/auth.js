const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 从请求头获取 token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token ? '***' : 'no token');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // 确保用户ID存在
    if (!decoded.id) {
      console.error('No user ID in token');
      return res.status(401).json({ error: 'Invalid token structure' });
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
}; 