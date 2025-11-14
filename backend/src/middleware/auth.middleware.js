const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['authorization'] || req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided. Authentication required.'
      });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, config.secret);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'User account is inactive'
      });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to authenticate token'
    });
  }
};

module.exports = { verifyToken };