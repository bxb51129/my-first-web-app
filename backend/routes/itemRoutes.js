const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const jwt = require('jsonwebtoken');

// 中间件：验证 token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// 获取所有 items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新 item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const item = new Item({
      title,
      description,
      user: req.user.id
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新 item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除 item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 