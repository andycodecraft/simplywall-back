const Broker = require('../models/broker');
const transformData = require('../../utils/transform_data');
// Create a new broker page
exports.createBroker = async (req, res) => {
  try {
    const broker = new Broker(req.body);
    await broker.save();
    const transformedData = transformData(broker.toObject());
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

// Get all brokers with filters
exports.getBrokers = async (req, res) => {
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

    if (req.query.mc) {
      Object.assign(query, handleFilter('mc', req.query.mc));
    }

    if (req.query.broker_name) {
      Object.assign(query, handleFilter('brokers.name', req.query.broker_name));
    }

    const brokers = await Broker.find(query).lean();
    const transformedData = transformData(brokers);

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

// Get a single broker page by ID
exports.getBrokerById = async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.id).lean();
    if (!broker) {
      const resData = {
          status: false,
          response: 'Broker not found'
      };
      return res.status(404).json(resData);
    }

    const transformedData = transformData(broker);
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

// Update multiple broker pages
exports.updateBroker = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
      const updatedBroker = await Broker.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedBroker) {
          return res.status(404).json({ message: 'Broker not found' });
      }

      const transformedData = transformData(updatedBroker.toObject());
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

// Delete a broker by ID
exports.deleteBroker = async (req, res) => {
  try {
    const broker = await Broker.deleteOne({ _id: req.params.id });
    if (broker.deletedCount === 0) {
      const resData = {
        status: false,
        response: 'Broker not found'
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

// Add a review to a broker
exports.addBrokerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const broker = await Broker.findById(id);
    if (!broker) {
      const resData = {
        status: false,
        response: 'Broker not found'
      };
      return res.status(404).json(resData);
    }

    broker.reviews.push(req.body);
    
    const transformedData = transformData(broker.reviews.toObject());
    await broker.save();

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

// Get all reviews for a broker page
exports.getBrokerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const broker = await Broker.findById(id);
    if (!broker) {
      const resData = {
        status: false,
        response: 'Broker not found'
      };
      return res.status(404).json(resData);
    }

    const transformedData = transformData(broker.reviews.toObject());
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

// Update a review within a broker page
exports.updateBrokerReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const broker = await Broker.findById(id);
    if (!broker) {
      const resData = {
        status: false,
        response: 'Broker not found'
      };
      return res.status(404).json(resData);
    }

    const review = broker.reviews.id(reviewId);
    if (!review) {
      const resData = {
        status: false,
        response: 'Review not found'
      };
      return res.status(404).json(resData);
    }

    Object.assign(review, req.body);

    const transformedData = transformData(review.toObject());
    await broker.save();
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

// Delete a review from a broker
exports.deleteBrokerReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const brokerPage = await Broker.findById(id);
    if (!brokerPage) {
      const resData = {
        status: false,
        response: 'Broker page not found'
      };
      return res.status(404).json(resData);
    }

    const reviewIndex = brokerPage.reviews.findIndex(review => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
      const resData = {
        status: false,
        response: 'Review not found'
      };
      return res.status(404).json(resData);
    }

    brokerPage.reviews.splice(reviewIndex, 1);
    await brokerPage.save();
    const resData = {
      status: true,
      response: 'Review deleted successfully'
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