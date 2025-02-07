const { stringify } = require('yamljs');
const Trailer = require('../models/trailer');
const transformData = require('../../utils/transform_data');

// Create a new trailer
exports.createTrailer = async (req, res) => {
  try {
    if (req.body.maintenanceDate) {
      req.body.maintenanceDate = new Date(req.body.maintenanceDate);
      if (isNaN(req.body.maintenanceDate)) {
        throw new Error('Invalid format for maintenanceDate');
      }
    }

    const trailer = new Trailer(req.body);
    await trailer.save();

    const transformedData = transformData(trailer.toObject());

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

// Get all trailers with filters
exports.getTrailers = async (req, res) => {
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

        if (field === 'maintenanceDate' || field === 'regEnd') {
          const dateValue = new Date(value);

          if (!isNaN(dateValue)) {
            return operationMap[property](field, dateValue);
          } else {
            throw new Error(`Invalid date format for ${field}`);
          }
        }

        return operationMap[property](field, value);

      } catch (err) {
        throw new Error(`Invalid parameter format for ${field}: ${err.message}`);
      }
    };

    // Implement your filters here based on query parameters
    if (req.query.trailerNo) {
      Object.assign(query, handleFilter('trailerNo', req.query.trailerNo));
    }

    if (req.query.carrier) {
      Object.assign(query, handleFilter('carrierId', req.query.carrier));
    }

    if (req.query.status) {
      Object.assign(query, handleFilter('status', req.query.status));
    }

    if (req.query.type) {
      Object.assign(query, handleFilter('type', req.query.type));
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

    const trailers = await Trailer.find(query).lean();
    const transformedData = transformData(trailers);

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

// Get a single trailer by ID
exports.getTrailerById = async (req, res) => {
  try {
    const trailer = await Trailer.findById(req.params.id);
    if (!trailer) {
      const resData = {
        status: false,
        response: 'Trailer not found'
      };
      return res.status(404).json(resData);
    }
    const transformedData = transformData(trailer.toObject());
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

// Delete a trailer by ID
exports.deleteTrailer = async (req, res) => {
  try {
    const trailer = await Trailer.findByIdAndDelete(req.params.id);
    if (!trailer) {
      const resData = {
        status: false,
        response: 'Trailer not found'
      };
      return res.status(404).json(resData);
    }
    const resData = {
      status: true,
      response: 'Trailer deleted successfully'
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

// Update multiple trailers
exports.updateTrailers = async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];
    const updateResults = [];
    const notFoundIds = [];

    for (const update of updates) {
      const { id, ...updateData } = update;
      const updatedTrailer = await Trailer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (updatedTrailer) {
        updateResults.push(updatedTrailer.toObject());
      } else {
        notFoundIds.push(id);
      }
    }

    if (notFoundIds.length > 0) {
      const resData = {
        status: false,
        response: {
          message: 'Some trailers were not found',
          not_found_ids: notFoundIds,
          updated_trailers: updateResults
        }
      };
      return res.status(404).json(resData);
    }

    const transformedData = transformData(updateResults);
    const resData = {
      status: true,
      response: {
        message: 'Trailers updated successfully',
        updated_trailers: transformedData
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