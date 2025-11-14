const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Customer = require('../models/Customer');
const LoanOfficer = require('../models/LoanOfficer');
const config = require('../config/auth.config');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { name, email, password, role, income, creditScore, branch } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role.toUpperCase()
    });

    await user.save();

    if (role.toUpperCase() === 'CUSTOMER') {
      const customer = new Customer({
        userId: user._id,
        income: income || 0,
        creditScore: creditScore || 650
      });
      await customer.save();
    } else if (role.toUpperCase() === 'OFFICER') {
      const officer = new LoanOfficer({
        userId: user._id,
        branch: branch || 'Main Branch'
      });
      await officer.save();
    }

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error registering user',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is inactive. Please contact support.'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    let profileId = null;
    if (user.role === 'CUSTOMER') {
      const customer = await Customer.findOne({ userId: user._id });
      profileId = customer ? customer._id : null;
    } else if (user.role === 'OFFICER') {
      const officer = await LoanOfficer.findOne({ userId: user._id });
      profileId = officer ? officer._id : null;
    }

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          userId: user._id,
          profileId,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during login',
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    let profile = null;
    if (user.role === 'CUSTOMER') {
      profile = await Customer.findOne({ userId: user._id });
    } else if (user.role === 'OFFICER') {
      profile = await LoanOfficer.findOne({ userId: user._id });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        profile
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching profile',
      error: error.message
    });
  }
};