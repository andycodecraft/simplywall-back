const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: String,
  url: String
});

const trailerSchema = new mongoose.Schema({
  trailerNo: { type: String, required: true },
  status: { type: Number, required: true },
  carrierId: { type: String, required: true },
  tin: String,
  vin: String,
  manuYear: String,
  licensePlate: String,
  maintenanceDate: Date,
  regEnd: Date,
  type: { type: String, required: true },
  dimensions: { type: String, required: true },
  axieConf: String,
  maxLbs: { type: Number, required: true },
  maxFt: { type: Number, required: true },
  policy: String,
  notes: String,
  documents: [documentSchema]
});

const Trailer = mongoose.model('Trailer', trailerSchema);

module.exports = Trailer;