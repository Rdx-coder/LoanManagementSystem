const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  income: {
    type: Number,
    min: [0, 'Income cannot be negative'],
    default: 0
  },
  creditScore: {
    type: Number,
    min: [300, 'Credit score must be at least 300'],
    max: [850, 'Credit score cannot exceed 850'],
    default: 650
  },
  employmentStatus: {
    type: String,
    enum: ['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED'],
    default: 'EMPLOYED'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  dateOfBirth: Date,
  panNumber: {
    type: String,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please provide a valid PAN number']
  }
}, { 
  timestamps: true 
});

customerSchema.index({ userId: 1 });

module.exports = mongoose.model('Customer', customerSchema);