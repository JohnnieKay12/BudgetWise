const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Transport',
        'Bolt/Uber',
        'Food & Jollof',
        'Generator Fuel',
        'POS Charges',
        'Airtime',
        'Data Subscription',
        'Family Support',
        'Church Offering',
        'Rent',
        'NEPA Bills',
        'Others',
      ],
      default: 'Others',
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // ================= MONTH SYSTEM =================
    month: {
      type: String,
      required: true,
      index: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ================= AUTO GENERATE MONTH =================
expenseSchema.pre('save', function (next) {
  const expenseDate = new Date(this.date);

  this.month = `${expenseDate.getFullYear()}-${String(
    expenseDate.getMonth() + 1
  ).padStart(2, '0')}`;

  next();
});

// ================= INDEXES =================
expenseSchema.index({ user: 1, date: -1 });

expenseSchema.index({
  user: 1,
  category: 1,
});

expenseSchema.index({
  user: 1,
  month: 1,
});

module.exports = mongoose.model(
  'Expense',
  expenseSchema
);