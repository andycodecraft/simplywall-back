const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
  userId: { type: String, required: true },    
  pageIndex: { type: Number, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  property: { type: String, required: true },
  value: { type: String, required: true }  
});

const filter = mongoose.model('Filter', filterSchema);

module.exports = filter;