const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
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
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Transport', 'Bolt/Uber', 'Food & Jollof', 'Generator Fuel', 'POS Charges',
      'Airtime', 'Data Subscription', 'Family Support', 'Church Offering', 'Rent', 'NEPA Bills',
      'Others',
    ],
    default: 'Others',
  },
  amount: {
    type: Number,
    min: 0,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

reminderSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
