module.exports = {
  secret: process.env.JWT_SECRET || 'fallback-secret-key-for-development',
  jwtExpiration: process.env.JWT_EXPIRES_IN || '24h',

  loanEvaluation: {
    minCreditScore: 300,
    maxCreditScore: 850,
    minIncome: 0,
    maxIncome: 10000000,
    creditScoreWeight: 0.6,
    incomeWeight: 0.4,
    approvalThreshold: 0.5
  },

  interestRates: {
    excellent: { min: 0.75, rate: 6.5 },
    good: { min: 0.60, rate: 8.5 },
    fair: { min: 0.50, rate: 11.5 },
    poor: { min: 0, rate: 15.0 }
  }
};