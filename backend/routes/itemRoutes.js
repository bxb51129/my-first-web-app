const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// 创建新项目
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    console.log('Creating task with data:', { title, description, priority, dueDate });
    console.log('User ID from token:', req.user.id);
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const item = new Item({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: req.user.id
    });

    console.log('Created item object:', item);

    const savedItem = await item.save();
    console.log('Saved item:', savedItem);
    
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Create item error details:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ 
      error: 'Error creating item',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取用户的所有项目
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// 获取单个项目
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Error fetching item' });
  }
});

// 更新项目
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    let item = await Item.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.status = status || item.status;

    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Error updating item' });
  }
});

// 删除项目
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router; 