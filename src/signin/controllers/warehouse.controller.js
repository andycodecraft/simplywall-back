const Warehouse = require('../models/warehouse');
const transformData = require('../../utils/transform_data')
// Create a new warehouse
exports.createWarehouse = async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    const transformedData = transformData(warehouse.toObject());

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

// Get all warehouses with filters
exports.getWarehouses = async (req, res) => {
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

    if (req.query.status) {
      Object.assign(query, handleFilter('status', req.query.status));
    }

    if (req.query.address) {
      Object.assign(query, handleFilter('address', req.query.address));
    }

    if (req.query.workingHours) {
      Object.assign(query, handleFilter('workingHours', req.query.workingHours));
    }

    const warehouses = await Warehouse.find(query).lean();
    const transformedData = transformData(warehouses);
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

// Get a single warehouse by ID
exports.getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      const resData = {
        status: false,
        response: 'Warehouse not found'
      };
      return res.status(404).json(resData);
    }
    const transformedData = transformData(warehouse.toObject());
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

// Update multiple warehouses
exports.updateWarehouses = async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];
    const updateResults = [];
    const notFoundIds = [];

    for (const update of updates) {
      const { id, ...updateData } = update;
      const updatedWarehouse = await Warehouse.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (updatedWarehouse) {
        updateResults.push(updatedWarehouse.toObject());
      } else {
        notFoundIds.push(id);
      }
    }

    if (notFoundIds.length > 0) {
      const resData = {
        status: false,
        response: {
          message: 'Some warehouses were not found',
          not_found_ids: notFoundIds,
          updated_warehouses: updateResults
        }
      };
      return res.status(404).json(resData);
    }

    const transformedData = transformData(updateResults);
    const resData = {
      status: true,
      response: {
        message: 'Warehouses updated successfully',
        updated_warehouses: transformedData
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

// Delete a warehouse by ID
exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      const resData = {
        status: false,
        response: 'Warehouse not found'
      };
      return res.status(404).json(resData);
    }
    const resData = {
      status: true,
      response: 'Warehouse deleted successfully'
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