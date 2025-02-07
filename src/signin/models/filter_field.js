const mongoose = require('mongoose');

const filterFieldSchema = new mongoose.Schema({
  pageIndex: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true }
}, {
    collection: 'filter_fields'
});

const filter_field = mongoose.model('FilterField', filterFieldSchema);

module.exports = filter_field;