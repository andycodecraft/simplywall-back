const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.getSigninResults = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resData = {
      status: true,
      response: {
        userId: user._id,
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ status: false, message: 'Email is already in use.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resData = {
      status: true,
      response: {
        userId: newUser._id,
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
