const express = require('express');
const router = express.Router();

let data = [
  { id: 1, name: 'Task 1' },
  { id: 2, name: 'Task 2' },
];

// 获取数据
router.get('/', (req, res) => {
  res.json(data);
});

// 添加数据
router.post('/', (req, res) => {
  const newItem = { id: Date.now(), name: req.body.name };
  data.push(newItem);
  res.status(201).json(newItem);
});

// 删除数据
router.delete('/:id', (req, res) => {
  data = data.filter((item) => item.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = router;
