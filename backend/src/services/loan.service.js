const LoanApplication = require('../models/LoanApplication');
const Customer = require('../models/Customer');
const config = require('../config/auth.config');

const normalize = (value, min, max) => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

const calculateInterestRate = (eligibilityScore) => {
  const rates = config.interestRates;

  if (eligibilityScore >= rates.excellent.min) return rates.excellent.rate;
  if (eligibilityScore >= rates.good.min) return rates.good.rate;
  if (eligibilityScore >= rates.fair.min) return rates.fair.rate;
  return rates.poor.rate;
};

const evaluateLoan = async (applicationId) => {
  try {
    const application = await LoanApplication.findById(applicationId)
      .populate({
        path: 'customerId',
        select: 'income creditScore'
      });

    if (!application) {
      throw new Error('Loan application not found');
    }

    const customer = application.customerId;

    if (!customer) {
      throw new Error('Customer details not found');
    }

    const { 
      minCreditScore, 
      maxCreditScore, 
      minIncome, 
      maxIncome,
      creditScoreWeight,
      incomeWeight,
      approvalThreshold
    } = config.loanEvaluation;

    const creditScoreNorm = normalize(
      customer.creditScore, 
      minCreditScore, 
      maxCreditScore
    );

    const incomeNorm = normalize(
      customer.income, 
      minIncome, 
      Math.min(customer.income * 2, maxIncome)
    );

    const eligibilityScore = 
      (creditScoreWeight * creditScoreNorm) + 
      (incomeWeight * incomeNorm);

    let status = eligibilityScore >= approvalThreshold ? 'UNDER_REVIEW' : 'REJECTED';

    const interestRate = calculateInterestRate(eligibilityScore);

    application.eligibilityScore = Math.round(eligibilityScore * 100) / 100;
    application.status = status;
    application.interestRate = interestRate;

    application.monthlyEMI = application.calculateEMI();

    await application.save();

    return {
      eligibilityScore: application.eligibilityScore,
      status: application.status,
      interestRate: application.interestRate,
      monthlyEMI: application.monthlyEMI
    };

  } catch (error) {
    throw error;
  }
};

const getCustomerLoanStats = async (customerId) => {
  const stats = await LoanApplication.aggregate([
    { $match: { customerId: customerId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amountRequested' }
      }
    }
  ]);

  return stats;
};

const getOfficerLoanStats = async (officerId) => {
  const stats = await LoanApplication.aggregate([
    { $match: { officerId: officerId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amountRequested' }
      }
    }
  ]);

  return stats;
};

module.exports = {
  evaluateLoan,
  getCustomerLoanStats,
  getOfficerLoanStats,
  calculateInterestRate
};