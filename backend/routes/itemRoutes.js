const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const jwt = require('jsonwebtoken');

// 中间件：验证 token
const authenticateToken = (req, res, next) => {
  try {
    console.log('Authenticating request:', {
      method: req.method,
      path: req.path,
      headers: req.headers
    });

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('No authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    console.log('Token received:', token ? 'Token exists' : 'No token');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ error: 'Invalid token' });
      }
      
      console.log('Token verified, user:', user);
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// 获取所有 items
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching items for user:', req.user.id);
    const items = await Item.find({ user: req.user.id });
    console.log('Items found:', items.length);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: error.message });
  }
});

// 创建新 item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log('Creating new item:', { title, description });

    const item = new Item({
      title,
      description,
      user: req.user.id
    });
    
    await item.save();
    console.log('Item created:', item._id);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新 item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Updating item:', req.params.id);
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!item) {
      console.log('Item not found:', req.params.id);
      return res.status(404).json({ error: 'Item not found' });
    }
    console.log('Item updated:', item._id);
    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除 item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Deleting item:', req.params.id);
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!item) {
      console.log('Item not found:', req.params.id);
      return res.status(404).json({ error: 'Item not found' });
    }
    console.log('Item deleted:', req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 