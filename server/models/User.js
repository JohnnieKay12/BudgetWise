const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    avatar: {
      type: String,
      default: '',
    },

    currency: {
      type: String,
      default: 'NGN',
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },

    bio: {
      type: String,
      default: '',
      maxlength: 250,
    },

    phone: {
      type: String,
      default: '',
    },

    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    
      pushNotifications: {
        type: Boolean,
        default: true,
      },
    
      budgetAlerts: {
        type: Boolean,
        default: true,
      },
    
      savingsReminders: {
        type: Boolean,
        default: true,
      },

      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
    
      language: {
        type: String,
        enum: ['en', 'yo', 'ig', 'ha'],
        default: 'en',
      },
    },

    // Subscription
    subscriptionStatus: {
      type: String,
      enum: ['active', 'expired', 'pending', 'cancelled'],
      default: 'pending',
    },

    subscriptionPlan: {
      type: String,
      default: 'premium',
    },

    subscriptionStartDate: {
      type: Date,
      default: null,
    },

    subscriptionEndDate: {
      type: Date,
      default: null,
    },

    lastPaymentDate: {
      type: Date,
      default: null,
    },

    paystackCustomerCode: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return bcrypt.compare(
    candidatePassword,
    this.password
  );
};

// Remove sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.__v;

  return obj;
};

module.exports = mongoose.model(
  'User',
  userSchema
);