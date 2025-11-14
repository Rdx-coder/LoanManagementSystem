const express = require('express');
const { body } = require('express-validator');
const loanController = require('../controllers/loan.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isCustomer } = require('../middleware/role.middleware');

const router = express.Router();

router.use(verifyToken);

router.post('/apply', isCustomer, [
  body('amountRequested').isNumeric().withMessage('Loan amount is required')
    .isFloat({ min: 10000, max: 50000000 })
    .withMessage('Loan amount must be between ₹10,000 and ₹5,00,00,000'),
  body('tenureMonths').isInt({ min: 6, max: 360 })
    .withMessage('Tenure must be between 6 and 360 months'),
  body('loanType').optional().isIn(['PERSONAL', 'HOME', 'EDUCATION', 'BUSINESS', 'VEHICLE'])
    .withMessage('Invalid loan type'),
  body('purpose').optional().trim().isLength({ max: 500 })
    .withMessage('Purpose cannot exceed 500 characters')
], loanController.applyLoan);

router.get('/my-loans', isCustomer, loanController.getMyLoans);
router.get('/:id/status', loanController.getLoanStatus);
router.get('/:id', loanController.getLoanById);

module.exports = router;