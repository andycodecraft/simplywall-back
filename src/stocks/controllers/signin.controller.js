const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../connection');

exports.getSigninResults = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required.' });
    }

    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const [users] = await pool.query(query);
    if (users.length == 0) {
      return res.status(401).json({ status: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resData = {
      status: true,
      response: {
        userId: user.id,
        token
      }
    };
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required.' });
    }

    const existingQuery = `SELECT * FROM users WHERE email = '${email}' LIMIT 1;`
    const [results] = await pool.query(existingQuery);

    if (results.length > 0) {
      return res.status(401).json({ status: false, message: 'Email is already in use.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = `INSERT INTO users (email, password) VALUES ('${email}', '${hashedPassword}')`;
    
    const [inserted] = await pool.query(query);
    const lastInsertedId = inserted.insertId;
    const token = jwt.sign({ userId: lastInsertedId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resData = {
      status: true,
      response: {
        userId: lastInsertedId,
        token
      }
    };
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error.' });
  }
};

exports.getSignToken = async (req, res) => {
  try {
    const { email } = req.body;

    const token = jwt.sign({ userId: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resData = {
      status: true,
      response: {
        userId: email,
        token
      }
    };
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
