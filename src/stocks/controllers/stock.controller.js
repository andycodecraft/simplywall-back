const Stock = require('../models/stock');

exports.getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({});

    const resData = {
      status: true,
      response: stocks
    }

    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      response: error.message
    }
    res.status(400).json(resData);
  }
}