const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  status: { type: Number, required: true },
  posPlanner: String,
  colorPlanner: String
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;