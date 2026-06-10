const mongoose = require('mongoose');

const financialInsightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: String,
    default: 'general',
    trim: true,
  },
  impact: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FinancialInsight', financialInsightSchema);
