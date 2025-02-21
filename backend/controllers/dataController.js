const Data = require('../models/Data');

const getAllData = async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createData = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newData = new Data({ title, description });
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await Data.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    await Data.findByIdAndDelete(id);
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAllData, createData, updateData, deleteData };
