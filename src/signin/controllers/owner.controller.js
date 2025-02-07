const Owner = require('../models/owner');
const transformData = require('../../utils/transform_data')
// Create a new owner
exports.createOwner = async (req, res) => {
  try {
    const owner = new Owner(req.body);
    await owner.save();
    const transformedData = transformData(owner.toObject());

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

// Get all owners with filters
exports.getOwners = async (req, res) => {
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

    if (req.query.userName) {
      Object.assign(query, handleFilter('userName', req.query.userName));
    }

    if (req.query.status) {
      Object.assign(query, handleFilter('status', req.query.status));
    }

    const owners = await Owner.find(query).lean();
    const transformedData = transformData(owners);
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

// Get a single owner by ID
exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      const resData = {
        status: false,
        response: 'Owner not found'
      };
      return res.status(404).json(resData);
    }
    const transformedData = transformData(owner.toObject());
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

// Update multiple owners
exports.updateOwners = async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];
    const updateResults = [];
    const notFoundIds = [];

    for (const update of updates) {
      const { id, ...updateData } = update;
      const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (updatedOwner) {
        updateResults.push(updatedOwner.toObject());
      } else {
        notFoundIds.push(id);
      }
    }

    if (notFoundIds.length > 0) {
      const resData = {
        status: false,
        response: {
          message: 'Some owners were not found',
          not_found_ids: notFoundIds,
          updated_owners: updateResults
        }
      };
      return res.status(404).json(resData);
    }

    const transformedData = transformData(updateResults);
    const resData = {
      status: true,
      response: {
        message: 'Owners updated successfully',
        updated_owners: transformedData
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

// Delete an owner by ID
exports.deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) {
      const resData = {
        status: false,
        response: 'Owner not found'
      };
      return res.status(404).json(resData);
    }
    const resData = {
      status: true,
      response: 'Owner deleted successfully'
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