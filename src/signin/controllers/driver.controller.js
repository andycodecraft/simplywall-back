const transformData = require('../../utils/transform_data');
const Driver = require('../models/driver');
const Carrier = require('../models/carrier');

exports.createDriver = async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        const transformedData = transformData(driver.toObject());
    
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

exports.getDrivers = async (req, res) => {
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
            Object.assign(query, handleFilter('fullName', req.query.name));
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

        if (req.query.endorsements) {
            Object.assign(query, handleFilter('endorsements', req.query.endorsements));
        }

        if (req.query.address) {
            Object.assign(query, handleFilter('address', req.query.address));
        }

        if (req.query.cellPhone) {
            Object.assign(query, handleFilter('cellPhone', req.query.cellPhone));
        }

        if (req.query.trackingPhone) {
            Object.assign(query, handleFilter('trackingPhone', req.query.trackingPhone));
        }

        if (req.query.document) {
            Object.assign(query, handleFilter('documents.name', req.query.document));
        }

        const drivers = await Driver.find(query).lean();
        const transformedData = transformData(drivers);
        
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

exports.getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id).lean();

        if (!driver) {
            const resData = {
                status: false,
                response: 'Driver not found'
            };
            return res.status(404).json(resData);
        }

        const transformedData = transformData(driver);
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

exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.deleteOne({ _id: req.params.id });
        if (driver.deletedCount == 0) {
            const resData = {
                status: false,
                response: 'Driver not found'
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

exports.updateDrivers = async (req, res) => {
    try {
        const updates = Array.isArray(req.body) ? req.body : [req.body];
        const updateResults = [];
        const notFoundIds = [];

        for (const update of updates) {
            const { id, ...updateData } = update;
            const updatedDriver = await Driver.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
            
            const transformedData = transformData(updatedDriver);

            if (updatedDriver) {
                updateResults.push(transformedData);
            } else {
                notFoundIds.push(id);
            }
        }
        

        if (notFoundIds.length > 0) {
            const resData = {
                status: false,
                response: {
                    message: 'Some drivers were not found',
                    not_found_ids: notFoundIds,
                    updated_drivers: updateResults
                }
            };
            return res.status(404).json(resData);
        }

        const resData = {
            status: true,
            response: {
                message: 'Drivers updated successfully',
                updated_drivers: updateResults
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