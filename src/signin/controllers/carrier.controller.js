const Carrier = require('../models/carrier');
const Truck = require('../models/truck');
const Trailer = require('../models/trailer');
const transformData = require('../../utils/transform_data');

// Create a new carrier
exports.createCarrier = async (req, res) => {
  try {
    const carrier = new Carrier(req.body);
    await carrier.save();
    const transformedData = transformData(carrier.toObject());

    const resData = {
      status: true,
      response: transformedData
    };

    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      response: error.message
    };
    res.status(500).json(resData);
  }
};

exports.getCarriers = async (req, res) => {
  try {
    const query = {};

    const operationMap = {
      Is: (field, value) => ({ [field]: value }),
      'Is not': (field, value) => ({ [field]: { $ne: value } }),
      Contains: (field, value) => ({ [field]: { $regex: value, $options: 'i' } }),
      'Does not contain': (field, value) => ({ [field]: { $not: new RegExp(value, 'i') } }),
      'Starts with': (field, value) => ({ [field]: { $regex: `^${value}`, $options: 'i' } }),
      'Ends with': (field, value) => ({ [field]: { $regex: `${value}$`, $options: 'i' } }),
      'Is empty': (field) => ({ $or: [{ [field]: '' }, { [field]: null }] }),
      'Is not empty': (field) => ({ [field]: { $nin: ['', null] } })
    };

    const handleFilter = (field, param) => {
      try {
        const { property, value } = JSON.parse(decodeURIComponent(param));
        if (!operationMap[property]) {
          throw new Error(`Unsupported operation: ${property}`);
        }
        return operationMap[property](field, value);
      } catch (err) {
        throw new Error(`Invalid parameter format for ${field}: ${err.message}`);
      }
    };

    if (req.query.name) {
      Object.assign(query, handleFilter('name', req.query.name));
    }

    if (req.query.owner) {
      Object.assign(query, handleFilter('owner', req.query.owner));
    }

    if (req.query.status) {
      Object.assign(query, handleFilter('status', req.query.status));
    }

    if (req.query.mc) {
      Object.assign(query, handleFilter('mc', req.query.mc));
    }

    if (req.query.trucks) {
      Object.assign(query, handleFilter('trucks', req.query.trucks));
    }

    if (req.query.trailers) {
      Object.assign(query, handleFilter('trailers', req.query.trailers));
    }

    if (req.query.packet) {
      Object.assign(query, handleFilter('carrierPacket.name', req.query.packet));
    }

    const carriers = await Carrier.find(query, {address: 0, carrierDate: 0, carrierNotes: 0}).lean();
    const transformedData = transformData(carriers);
    const resData = {
      status: true,
      response: transformedData
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

// Get a single carrier by ID
exports.getCarrierById = async (req, res) => {
  try {
    const carrier = await Carrier.findById(req.params.id);
    if (!carrier) {
      const resData = {
        status: false,
        response: 'Carrier not found'
      };
      return res.status(404).json(resData);
    }
    const transformedData = transformData(carrier.toObject());
    const resData = {
      status: true,
      response: transformedData
    };
    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      response: error.message
    };
    res.status(500).json(resData);
  }
};

// Update a carrier
exports.updateCarrier = async (req, res) => {
  try {
    const carrier = await Carrier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!carrier) {
      const resData = {
        status: false,
        response: 'Carrier not found'
      };
      return res.status(404).json(resData);
    }
    const transformedData = transformData(carrier.toObject());
    const resData = {
      status: true,
      response: transformedData
    };
    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      response: error.message
    };
    res.status(500).json(resData);
  }
};

// Delete a carrier
exports.deleteCarrier = async (req, res) => {
  try {
    const carrier = await Carrier.deleteOne({ _id: req.params.id });
    if (carrier.deletedCount === 0) {
      const resData = {
        status: false,
        response: 'Carrier not found'
      };
      return res.status(404).json(resData);
    }
    const resData = {
      status: true,
      response: { deleted_id: req.params.id }
    };
    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      response: error.message
    };
    res.status(500).json(resData);
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