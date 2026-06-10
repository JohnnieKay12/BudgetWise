const mongoose = require('mongoose');

const savingsChallengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Challenge name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: 1,
  },
  participants: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SavingsChallenge', savingsChallengeSchema);
