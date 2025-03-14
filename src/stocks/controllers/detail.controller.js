const Stock = require('../models/detail');
const CryptoJS = require('crypto-js');

exports.getTopStocks = async (req, res) => {
  try {
    const details = await Stock.find({});

    const resData = {
      status: true,
      response: details
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

exports.getTopStockById = async (req, res) => {
  try {
    const encrypt_id = decodeURIComponent(req.body.stock_id);

    const secretKey = 'mySecretKey';
    const bytes = CryptoJS.AES.decrypt(encrypt_id, secretKey);
    const stock_id = bytes.toString(CryptoJS.enc.Utf8);

    const details = await Stock.findOne({_id: stock_id});

    const resData = {
      status: true,
      response: details
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
