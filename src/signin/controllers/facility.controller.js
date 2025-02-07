const transformData = require('../../utils/transform_data');
const Facility = require('../models/facility')

exports.createFacility = async (req, res) => {
    try {
        const facility = new Facility(req.body);
        await facility.save();
        const transformedData = transformData(facility.toObject());    
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

exports.getFacilities = async (req, res) => {
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
          
          // Check if the operation is supported
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
      
    if (req.query.address) {
      Object.assign(query, handleFilter('address', req.query.address));
    }

    if (req.query.workingHours) {
      Object.assign(query, handleFilter('workingHours', req.query.workingHours));
    }

    let contactQueries = [];
    
    if (req.query.contact_name) {
      const contactNameFilter = handleFilter('name', req.query.contact_name);
      if (contactNameFilter) {
        contactQueries.push(contactNameFilter);
      }
    }

    if (req.query.contact_phone) {
      const contactPhoneFilter = handleFilter('phone', req.query.contact_phone);
      if (contactPhoneFilter) {
        contactQueries.push(contactPhoneFilter);
      }
    }

    if (req.query.contact_email) {
      const contactEmailFilter = handleFilter('email', req.query.contact_email);
      if (contactEmailFilter) {
        contactQueries.push(contactEmailFilter);
      }
    }

    if (contactQueries.length > 0) {
      query.contacts = { $elemMatch: { $and: contactQueries } };
    }


    const facilities = await Facility.find(query, {"googleReviewDetails": 0, "ourCommentsDetails": 0}).lean();
    const transformedData = transformData(facilities);
    const resData = {
      status: true,
      response: transformedData
    }
    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      response: error.message
    }
    res.status(400).json(resData);
  }
};

exports.getFacilityById = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (!facility) {
            return res.status(404).json({ message: 'Facility not found' });
        }
        const transformedData = transformData(facility.toObject());
        const resData = {
          status: true,
          response: transformedData
        }
        res.status(200).json(resData);
    } catch (error) {
        const resData = {
          status: false,
          response: error.message
        }
        res.status(500).json(resData);
    }
};

exports.deleteFacility = async (req, res) => {
    try {
        const facility = await Facility.deleteOne({_id: req.params.id});
        if (facility.deletedCount == 0) {
            return res.status(404).json({ message: 'Facility not found' });
        }
        const resData = {
          status: true,
          response: {deleted_id: req.params.id}
        };
        res.status(200).json({ message: 'Facility deleted successfully', resData});
        
    } catch (error) {
        const resData = {
          status: false,
          response: error.message
        };
        res.status(500).json(resData);
    }
};


exports.updateFacility = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedFacility = await Facility.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedFacility) {
            return res.status(404).json({ message: 'Facility not found' });
        }

        const transformedData = transformData(updatedFacility.toObject());
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

exports.getGoogleReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);
    if (!facility) {
      const resData = {
        status: false,
        response: 'Facility not found'
      };
      return res.status(404).json(resData);
    }

    const transformedData = transformData(facility.googleReviewDetails.toObject());
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

exports.addOurComment = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);
    if (!facility) {
      const resData = {
        status: false,
        response: 'Facility not found'
      };
      return res.status(404).json(resData);
    }

    facility.ourCommentsDetails.push(req.body);
    const transformedData = transformData(facility.ourCommentsDetails.toObject());
    await facility.save();
    
    const resData = {
      status: true,
      response: transformedData
    };
    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: true,
      response: error.message
    };
    res.status(500).json(resData);
  }
};

exports.getOurComments = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);
    if (!facility) {
      const resData = {
        status: false,
        response: 'Facility not found'
      };
      return res.status(404).json(resData);
    }
    const transformedData = transformData(facility.ourCommentsDetails.toObject());
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

exports.updateOurComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const facility = await Facility.findById(id, { __v: 0 });
    if (!facility) {
      const resData = {
        status: false,
        response: 'Facility not found'
      };
      return res.status(404).json(resData);
    }

    const comment = facility.ourCommentsDetails.id(commentId);
    if (!comment) {
      const resData = {
        status: false,
        response: 'Comment not found'
      };
      return res.status(404).json(resData);
    }

    Object.assign(comment, req.body);
    await facility.save();
    const transformedData = transformData(comment.toObject());
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

exports.deleteOurComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const facility = await Facility.findById(id);
    if (!facility) {
      const resData = {
        status: true,
        response: 'Facility not found'
      };
      return res.status(404).json(resData);
    }

    const reviewIndex = facility.ourCommentsDetails.findIndex(review => review._id.toString() === commentId);
    if (reviewIndex === -1) {
      const resData = {
        status: true,
        response: 'Review not found'
      };
      return res.status(404).json(resData);
    }

    // Remove the review using array manipulation
    facility.ourCommentsDetails.splice(reviewIndex, 1);

    // Save the changes to the document
    await facility.save();
    const resData = {
      status: true,
      response: 'Comment deleted successfully'
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