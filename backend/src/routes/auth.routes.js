const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['CUSTOMER', 'OFFICER', 'customer', 'officer'])
    .withMessage('Role must be CUSTOMER or OFFICER'),
  body('income').optional().isNumeric().withMessage('Income must be a number'),
  body('creditScore').optional().isInt({ min: 300, max: 850 })
    .withMessage('Credit score must be between 300 and 850')
], authController.register);

router.post('/login', [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

router.get('/me', verifyToken, authController.getProfile);

module.exports = router;