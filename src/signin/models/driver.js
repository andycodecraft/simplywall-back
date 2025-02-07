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

const driverSchema = new mongoose.Schema({
    fullName: { type:String, required: true },
    address: String,
    status: { type: Number, required: true },
    trucks: [String],
    carrierId: String,
    contacts: [contactInfoSchema],
    type: Number,
    email: String,
    documents: [documentSchema],
    date: Date,
    notes: String,
    endorsements: [Number],
    cellPhone: String,
    trackingPhone: String
});

module.exports = mongoose.model('Driver', driverSchema);