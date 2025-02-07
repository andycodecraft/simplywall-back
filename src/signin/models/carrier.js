const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  name: String,
  position: String,
  phone: String,
  email: String
});

const documentSchema = new mongoose.Schema({
  name: String,
  url: String
});

const carrierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: Number, required: true },
  owner: String,
  trucks: [String],
  trailers: [String],
  mc: String,
  dot: String,
  scac: String,
  address: { type: String, required: true },
  contacts: [contactInfoSchema],
  carrierPacket: [documentSchema],
  carrierDate: { type: Date, default: Date.now },
  carrierNotes: String
});

module.exports = mongoose.model('Carrier', carrierSchema);