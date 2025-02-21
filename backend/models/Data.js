const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Data = mongoose.models.Data || mongoose.model('Data', dataSchema);

module.exports = Data;
