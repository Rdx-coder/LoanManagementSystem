const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  officerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanOfficer',
    default: null
  },
  amountRequested: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [10000, 'Minimum loan amount is ₹10,000'],
    max: [50000000, 'Maximum loan amount is ₹5 Crores']
  },
  tenureMonths: {
    type: Number,
    required: [true, 'Loan tenure is required'],
    min: [6, 'Minimum tenure is 6 months'],
    max: [360, 'Maximum tenure is 360 months (30 years)']
  },
  interestRate: {
    type: Number,
    min: 0,
    max: 30
  },
  status: {
    type: String,
    enum: {
      values: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      message: '{VALUE} is not a valid status'
    },
    default: 'PENDING',
    uppercase: true
  },
  eligibilityScore: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  loanType: {
    type: String,
    enum: ['PERSONAL', 'HOME', 'EDUCATION', 'BUSINESS', 'VEHICLE'],
    default: 'PERSONAL',
    uppercase: true
  },
  purpose: {
    type: String,
    trim: true,
    maxlength: 500
  },
  monthlyEMI: {
    type: Number,
    default: null
  },
  reviewNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  reviewedAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

loanApplicationSchema.index({ customerId: 1 });
loanApplicationSchema.index({ officerId: 1 });
loanApplicationSchema.index({ status: 1 });
loanApplicationSchema.index({ createdAt: -1 });

loanApplicationSchema.methods.calculateEMI = function() {
  if (!this.interestRate || !this.amountRequested || !this.tenureMonths) {
    return null;
  }

  const P = this.amountRequested;
  const r = this.interestRate / 12 / 100;
  const n = this.tenureMonths;

  if (r === 0) {
    return P / n;
  }

  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
};

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);