const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, 'Goal name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [1, 'Target must be at least 1'],
    },

    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General',
      trim: true,
    },

    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
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
savingsGoalSchema.pre('save', function (next) {
  const goalDate = new Date(
    this.createdAt || Date.now()
  );

  this.month = `${goalDate.getFullYear()}-${String(
    goalDate.getMonth() + 1
  ).padStart(2, '0')}`;

  next();
});

// ================= INDEXES =================
savingsGoalSchema.index({
  user: 1,
  status: 1,
});

savingsGoalSchema.index({
  user: 1,
  month: 1,
});

module.exports = mongoose.model(
  'SavingsGoal',
  savingsGoalSchema
);