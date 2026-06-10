const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
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
    },

    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [1, 'Limit must be at least 1'],
    },

    // ================= MONTHLY SPENDING =================
    spent: {
      type: Number,
      default: 0,
      min: 0,
    },

    period: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly'],
      default: 'monthly',
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: function () {
        const d = new Date();

        d.setMonth(d.getMonth() + 1);

        return d;
      },
    },

    // ================= MONTH SYSTEM =================
    month: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ================= AUTO GENERATE MONTH =================
budgetSchema.pre('save', function (next) {
  const budgetDate = new Date(this.startDate);

  this.month = `${budgetDate.getFullYear()}-${String(
    budgetDate.getMonth() + 1
  ).padStart(2, '0')}`;

  next();
});

// ================= INDEXES =================
budgetSchema.index({
  user: 1,
  category: 1,
});

budgetSchema.index({
  user: 1,
  month: 1,
});

module.exports = mongoose.model(
  'Budget',
  budgetSchema
);