const { validationResult } = require('express-validator');
const LoanApplication = require('../models/LoanApplication');
const LoanOfficer = require('../models/LoanOfficer');
const loanService = require('../services/loan.service');

exports.getPendingLoans = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const pendingLoans = await LoanApplication.find({ 
      status: { $in: ['PENDING', 'UNDER_REVIEW'] }
    })
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LoanApplication.countDocuments({ 
      status: { $in: ['PENDING', 'UNDER_REVIEW'] }
    });

    res.status(200).json({
      status: 'success',
      data: {
        loans: pendingLoans,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get pending loans error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching pending loans',
      error: error.message
    });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', minAmount, maxAmount } = req.query;
    const query = {};
    if (status) query.status = status.toUpperCase();
    if (minAmount || maxAmount) {
      query.amountRequested = {};
      if (minAmount) query.amountRequested.$gte = parseFloat(minAmount);
      if (maxAmount) query.amountRequested.$lte = parseFloat(maxAmount);
    }

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const loans = await LoanApplication.find(query)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'officerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LoanApplication.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        loans,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all loans error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching loans',
      error: error.message
    });
  }
};

exports.reviewLoan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const loanApplication = await LoanApplication.findById(id)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      });

    if (!loanApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan application not found'
      });
    }

    if (loanApplication.status === 'APPROVED' || loanApplication.status === 'REJECTED') {
      return res.status(400).json({
        status: 'error',
        message: `Loan has already been ${loanApplication.status.toLowerCase()}`
      });
    }

    const officer = await LoanOfficer.findOne({ userId: req.userId });
    if (!officer) {
      return res.status(404).json({
        status: 'error',
        message: 'Officer profile not found'
      });
    }

    const validStatuses = ['APPROVED', 'REJECTED', 'UNDER_REVIEW'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be APPROVED, REJECTED, or UNDER_REVIEW'
      });
    }

    loanApplication.status = status.toUpperCase();
    loanApplication.officerId = officer._id;
    loanApplication.reviewNotes = reviewNotes || '';
    loanApplication.reviewedAt = new Date();

    await loanApplication.save();

    if (status.toUpperCase() === 'APPROVED') {
      officer.stats.totalApproved += 1;
    } else if (status.toUpperCase() === 'REJECTED') {
      officer.stats.totalRejected += 1;
    }
    officer.stats.totalReviewed += 1;
    await officer.save();

    await loanApplication.populate({
      path: 'officerId',
      populate: { path: 'userId', select: 'name email' }
    });

    res.status(200).json({
      status: 'success',
      message: `Loan application ${status.toLowerCase()} successfully`,
      data: loanApplication
    });

  } catch (error) {
    console.error('Review loan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error reviewing loan application',
      error: error.message
    });
  }
};

exports.getOfficerStats = async (req, res) => {
  try {
    const officer = await LoanOfficer.findOne({ userId: req.userId });
    if (!officer) {
      return res.status(404).json({
        status: 'error',
        message: 'Officer profile not found'
      });
    }

    const loanStats = await loanService.getOfficerLoanStats(officer._id);
    const totalPending = await LoanApplication.countDocuments({ 
      status: { $in: ['PENDING', 'UNDER_REVIEW'] }
    });
    const totalLoans = await LoanApplication.countDocuments({});

    const recentLoans = await LoanApplication.find({ officerId: officer._id })
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ reviewedAt: -1 })
      .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        officer: {
          name: officer.userId ? (await officer.populate('userId')).userId.name : 'Unknown',
          branch: officer.branch,
          stats: officer.stats
        },
        systemStats: {
          totalPending,
          totalLoans
        },
        loanStats,
        recentLoans
      }
    });

  } catch (error) {
    console.error('Get officer stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching officer statistics',
      error: error.message
    });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const officer = await LoanOfficer.findOne({ userId: req.userId });
    if (!officer) {
      return res.status(404).json({
        status: 'error',
        message: 'Officer profile not found'
      });
    }

    const query = { officerId: officer._id };
    if (status) {
      query.status = status.toUpperCase();
    }

    const skip = (page - 1) * limit;
    const loans = await LoanApplication.find(query)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ reviewedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LoanApplication.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        loans,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching reviewed loans',
      error: error.message
    });
  }
};

module.exports = exports;