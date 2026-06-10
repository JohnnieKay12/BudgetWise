const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    default: 'paystack',
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  paystackResponse: {
    type: Object,
    default: {},
  },
}, {
  timestamps: true,
});

paymentSchema.index({ user: 1, transactionDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
