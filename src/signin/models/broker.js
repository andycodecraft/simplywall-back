const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  regular: Boolean // Maybe a boolean if it's more appropriate
});

const brokerReviewSchema = new mongoose.Schema({
  name: String,
  date: String, // Consider using Date type if possible
  rating: Number,
  text: String
});

const brokerPageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  mc: Number,
  rating: Number,
  brokers: [brokerSchema],
  reviews: [brokerReviewSchema]
});

const BrokerPage = mongoose.model('Broker', brokerPageSchema);

module.exports = BrokerPage;