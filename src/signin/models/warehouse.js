const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  name: String,
  position: String,
  phone: String,
  email: String
});

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: Number, required: true },
  address: { type: String, required: true },
  workingHours: { type: String, required: true },
  notes: String,
  contacts: [contactInfoSchema]
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;