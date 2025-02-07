const Carrier = require('../models/carrier');
const Truck = require('../models/truck');
const Trailer = require('../models/trailer');

exports.getCarriers = async (req, res) => {
    try {

        const carriers = await Carrier.find({}, 'name').select('_id name').lean();

        const transformedCarriers = carriers.map(carrier => ({
            id: carrier._id,
            name: carrier.name
        }));

        const resData = {
            status: true,
            response: transformedCarriers
        };
        res.status(200).json(resData);
    } catch (error) {
        const resData = {
            status: false,
            response: error.message
        };
        res.status(400).json(resData);
    }
};

exports.getTrucks = async (req, res) => {
    try {
        const trucks = await Truck.find({}, 'truckNo').select('_id truckNo').lean();
        const transformedTrucks = trucks.map(truck => ({
            id: truck._id,
            name: truck.truckNo
        }));

        const resData = {
            status: true,
            response: transformedTrucks
        };
        res.status(200).json(resData);
    } catch (error) {
        const resData = {
            status: false,
            response: error.message
        };
        res.status(400).json(resData);
    }
};

exports.getTrailers = async (req, res) => {
    try {

        const trailers = await Trailer.find({}, 'trailerNo').select('_id trailerNo').lean();

        const transformedTrailers = trailers.map(trailer => ({
            id: trailer._id,
            name: trailer.trailerNo
        }));

        const resData = {
            status: true,
            response: transformedTrailers
        };
        res.status(200).json(resData);
    } catch (error) {
        const resData = {
            status: false,
            response: error.message
        };
        res.status(400).json(resData);
    }
};