const pool = require('../connection');

exports.getStocks = async (req, res) => {
  try {
    const query = 'SELECT * FROM stock_pitches'
    const [stocks] = await pool.query(query);

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