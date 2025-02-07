const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
    name: String,
    position: String,
    phone: String,
    email: String,
})

const reviewSchema = new mongoose.Schema({
    name: String,
    date: String,
    rating: Number,
    text: String,
});

const facilitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    workingHours: {
        type: [[String, String]], // Array of arrays, each containing two string times
        validate: {
          validator: function(v) {
            return v.every(range => range.length === 2 && range.every(time => /^\d{2}:\d{2}$/.test(time)));
          },
          message: props => `${props.value} is not a valid time range!`
        }
    },
    contacts: [contactInfoSchema],
    googleReviews: Number,
    ourComments: Number,
    googleReviewDetails: [reviewSchema],
    ourCommentsDetails: [reviewSchema],
});

const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;