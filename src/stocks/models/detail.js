const mongoose = require('mongoose');

const detailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  last_price: { type: Number, required: true },
  market_cap: { type: String, required: true },
  sevend_value: { type: Number, required: true },
  oney_value: { type: Number, required: true },
  score: { type: Number, required: true },
  detail: { type: Array }
});

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;