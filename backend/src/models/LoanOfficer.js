const mongoose = require('mongoose');

const loanOfficerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  branch: {
    type: String,
    trim: true,
    default: 'Main Branch'
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    enum: ['PERSONAL_LOANS', 'HOME_LOANS', 'BUSINESS_LOANS', 'GENERAL'],
    default: 'GENERAL'
  },
  approvalLimit: {
    type: Number,
    default: 10000000,
    min: 0
  },
  stats: {
    totalReviewed: { type: Number, default: 0 },
    totalApproved: { type: Number, default: 0 },
    totalRejected: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

loanOfficerSchema.index({ userId: 1 });
loanOfficerSchema.index({ branch: 1 });

module.exports = mongoose.model('LoanOfficer', loanOfficerSchema);