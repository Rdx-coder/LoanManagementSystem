const { validationResult } = require('express-validator');
const LoanApplication = require('../models/LoanApplication');
const Customer = require('../models/Customer');
const loanService = require('../services/loan.service');

exports.applyLoan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { amountRequested, tenureMonths, loanType, purpose } = req.body;
    const customer = await Customer.findOne({ userId: req.userId });

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer profile not found'
      });
    }

    const loanApplication = new LoanApplication({
      customerId: customer._id,
      amountRequested,
      tenureMonths,
      loanType: loanType ? loanType.toUpperCase() : 'PERSONAL',
      purpose: purpose || ''
    });

    await loanApplication.save();
    const evaluation = await loanService.evaluateLoan(loanApplication._id);
    const updatedApplication = await LoanApplication.findById(loanApplication._id)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      });

    res.status(201).json({
      status: 'success',
      message: 'Loan application submitted successfully',
      data: {
        loanId: loanApplication._id,
        application: updatedApplication,
        evaluation
      }
    });

  } catch (error) {
    console.error('Apply loan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error submitting loan application',
      error: error.message
    });
  }
};

exports.getLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const loanApplication = await LoanApplication.findById(id)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'officerId',
        populate: { path: 'userId', select: 'name email' }
      });

    if (!loanApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan application not found'
      });
    }

    const customer = await Customer.findOne({ userId: req.userId });
    if (customer && loanApplication.customerId._id.toString() !== customer._id.toString()) {
      if (req.userRole !== 'OFFICER') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        loanId: loanApplication._id,
        status: loanApplication.status,
        eligibilityScore: loanApplication.eligibilityScore,
        amountRequested: loanApplication.amountRequested,
        tenureMonths: loanApplication.tenureMonths,
        interestRate: loanApplication.interestRate,
        monthlyEMI: loanApplication.monthlyEMI,
        loanType: loanApplication.loanType,
        createdAt: loanApplication.createdAt,
        reviewedAt: loanApplication.reviewedAt,
        reviewNotes: loanApplication.reviewNotes
      }
    });

  } catch (error) {
    console.error('Get loan status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching loan status',
      error: error.message
    });
  }
};

exports.getMyLoans = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.userId });
    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer profile not found'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const query = { customerId: customer._id };
    if (status) {
      query.status = status.toUpperCase();
    }

    const skip = (page - 1) * limit;
    const loans = await LoanApplication.find(query)
      .populate({
        path: 'officerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LoanApplication.countDocuments(query);
    const stats = await loanService.getCustomerLoanStats(customer._id);

    res.status(200).json({
      status: 'success',
      data: {
        loans,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        },
        stats
      }
    });

  } catch (error) {
    console.error('Get my loans error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching loans',
      error: error.message
    });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const loanApplication = await LoanApplication.findById(id)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'officerId',
        populate: { path: 'userId', select: 'name email' }
      });

    if (!loanApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan application not found'
      });
    }

    const customer = await Customer.findOne({ userId: req.userId });
    if (customer && loanApplication.customerId._id.toString() !== customer._id.toString()) {
      if (req.userRole !== 'OFFICER') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: loanApplication
    });

  } catch (error) {
    console.error('Get loan by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching loan details',
      error: error.message
    });
  }
};