const Filter = require('../models/filter');
const FilterField = require('../models/filter_field');
const transformData = require('../../utils/transform_data');
exports.getFilterFields = async (req, res) => {
    try {
  
      const filters = await FilterField.find().lean();
      const transformedData = transformData(filters);      
      res.status(200).json({ status: true, response: transformedData });
    } catch (error) {
      res.status(500).json({ status: false, response: error.message });
    }
};

// Create a new filter
exports.createFilter = async (req, res) => {
  try {
    const filter = new Filter(req.body);
    const transformedData = transformData(filter.toObject());

    const resData = {
      status: true,
      response: transformedData
    };
    await filter.save();
    res.status(201).json(resData);
  } catch (error) {
    res.status(500).json({ status: false, response: error.message });
  }
};

exports.getFilters = async (req, res) => {
    try {
      const query = {};

      if (req.query.userId) {
        query.userId = req.query.userId;
      }
        
      if (req.query.pageIndex) {
        query.pageIndex = req.query.pageIndex;
      }
  
      const filters = await Filter.find(query).lean();
      const transformedData = transformData(filters);

      res.status(200).json({ status: true, response: transformedData });
    } catch (error) {
      res.status(500).json({ status: false, response: error.message });
    }
};

// Delete a filter by ID
exports.deleteFilter = async (req, res) => {
  try {
    const filter = await Filter.findByIdAndDelete(req.params.id);
    if (!filter) {
      return res.status(404).json({ status: false, response: 'Filter not found' });
    }
    res.status(200).json({ status: true, response: 'Filter deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, response: error.message });
  }
};