const Truck = require('../models/truck');
const transformData = require('../../utils/transform_data');

// Create a new truck
exports.createTruck = async (req, res) => {
  try {
    const truck = new Truck(req.body);
    await truck.save();
    const transformedData = transformData(truck.toObject());

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

// Get all trucks
exports.getTrucks = async (req, res) => {
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

    if (req.query.truckNo) {
      Object.assign(query, handleFilter('truckNo', req.query.truckNo));
    }

    if (req.query.carrier) {
      Object.assign(query, handleFilter('carrierId', req.query.carrier));
    }

    if (req.query.driver) {
      Object.assign(query, handleFilter('driverId', req.query.driver));
    }

    if (req.query.status) {
      Object.assign(query, handleFilter('status', req.query.status));
    }

    if (req.query.type) {
      Object.assign(query, handleFilter('type', req.query.type));
    }

    if (req.query.resAssistant) {
      Object.assign(query, handleFilter('resAssistant', req.query.resAssistant));
    }

    if (req.query.resDispatcher) {
      Object.assign(query, handleFilter('resDispatcher', req.query.resDispatcher));
    }

    if (req.query.maintenanceDate) {
      Object.assign(query, handleFilter('maintenanceDate', req.query.maintenanceDate));
    }

    if (req.query.regEnd) {
      Object.assign(query, handleFilter('regEnd', req.query.regEnd));
    }

    if (req.query.vin) {
      Object.assign(query, handleFilter('vin', req.query.vin));
    }

    if (req.query.licensePlate) {
      Object.assign(query, handleFilter('licensePlate', req.query.licensePlate));
    }

    if (req.query.maxLbs) {
      Object.assign(query, handleFilter('maxLbs', req.query.maxLbs));
    }

    if (req.query.document) {
      Object.assign(query, handleFilter('documents.name', req.query.document));
    }

    const trucks = await Truck.find(query).lean();
    const transformedData = transformData(trucks);

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

// Get a single truck by ID
exports.getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      const resData = {
        status: false,
        response: 'Truck not found'
      };
      return res.status(404).json(resData);
    }

    const transformedData = transformData(truck.toObject());
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

// Delete a truck by ID
exports.deleteTruck = async (req, res) => {
  try {    
    const truck = await Truck.deleteOne({_id: req.params.id});
    if (truck.deletedCount === 0) {
      const resData = {
        status: false,
        response: 'Truck not found'
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

// Update multiple trucks
exports.updateTrucks = async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];
    const updateResults = [];
    const notFoundIds = [];

    for (const update of updates) {
      const { id, ...updateData } = update;
      const updatedTruck = await Truck.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });


      if (updatedTruck) {
        updateResults.push(updatedTruck);
      } else {
        notFoundIds.push(id);
      }
    }

    if (notFoundIds.length > 0) {
      const resData = {
        status: false,
        response: {
          message: 'Some trucks were not found',
          not_found_ids: notFoundIds,
          updated_trucks: updateResults
        }
      };
      return res.status(404).json(resData);
    }

    const transformedData = transformData(updateResults);
    const resData = {
      status: true,
      response: {
        message: 'Trucks updated successfully',
        updated_trucks: transformedData
      }
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