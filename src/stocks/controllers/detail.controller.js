const CryptoJS = require('crypto-js');
const pool = require('../connection');

exports.getTopStocks = async (req, res) => {
  try {
    const query = `SELECT * FROM top_ideas`;
    const [details] = await pool.query(query);

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
    
    const query = `SELECT * FROM top_ideas WHERE id = ${stock_id}`;
    const [details] = await pool.query(query);

    const content_query = `SELECT * FROM idea_details WHERE idea_id = ${stock_id}`;
    const [contents] = await pool.query(content_query);
    
    if (details) {
      details[0]['detail'] = contents
    }

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
