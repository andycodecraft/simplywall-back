const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  symbol_ticker: { type: String, required: true },
  ai_rating: { type: Number, required: true },
  advice_type: { type: String, required: true },
  stock_price: { type: Number, required: true },
  market_cap: { type: Number, required: true },
  sub_industry: { type: String },
  risk_level: { type: String },
  est_upside: { type: Number },
  return_rating: { type: Number }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;