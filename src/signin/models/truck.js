const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: String,
    url: String
});

const truckSchema = new mongoose.Schema({
    truckNo: { type: String, required: true},
    status: { type: Number, required: true},
    carrierId: String,
    makeModel: String,
    vin: String,
    manuYear: String,
    licensePlate: String,
    maintenanceDate: Date,
    regEnd: Date,
    type: String,
    resAssistant: String,
    resDispatcher: String,
    maxLbs: Number,
    policy: String,
    driverId: String,
    teleGroup: String,
    notes: String,
    documents: [documentSchema]
});

module.exports = mongoose.model('Truck', truckSchema);