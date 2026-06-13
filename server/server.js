require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// THESE MUST MATCH YOUR FILE NAMES
const insightRoutes = require('./routes/insights');
const challengeRoutes = require('./routes/challenges');

const app = express();

// ================= SECURITY MIDDLEWARE =================
app.use(helmet());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://budget-wise-lsma.vercel.app',
      'https://budget-wise-ry6r.vercel.app',
    ],
    credentials: true,
  })
);

// ================= RATE LIMITING =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max:
    process.env.NODE_ENV ===
    'development'
      ? 10000
      : 100,

  message: {
    message:
      'Too many requests, please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// GLOBAL API LIMITER
app.use('/api', limiter);

// AUTH LIMITER
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 20,

    message: {
      message:
        'Too many auth attempts, please try again later.',
    },

    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ================= BODY PARSER =================
app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ================= LOGGER =================
app.use(morgan('dev'));

// ================= DATABASE CONNECTION =================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb://localhost:27017/budgetwise'
    );

    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(
      `Database connection error: ${error.message}`
    );

    console.log(
      'Running in demo mode - some features may not persist data'
    );
  }
};

connectDB();

// ================= API ROUTES =================
app.use('/api/auth', authRoutes);

app.use('/api/expenses', expenseRoutes);

app.use('/api/budgets', budgetRoutes);

app.use('/api/savings', savingsRoutes);

app.use('/api/reminders', reminderRoutes);

app.use(
  '/api/notifications',
  notificationRoutes
);

app.use('/api/users', userRoutes);

app.use('/api/payments', paymentRoutes);

app.use('/api/dashboard', dashboardRoutes);

// FIXED HERE
app.use('/api/insights', insightRoutes);

app.use(
  '/api/challenges',
  challengeRoutes
);

// ================= ROOT ROUTE =================
app.get('/', (req, res) => {
  res.json({
    app: 'BudgetWise API',
    status: 'running',
  });
});

// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',

    timestamp:
      new Date().toISOString(),

    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',

    environment:
      process.env.NODE_ENV ||
      'development',
  });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ================= ERROR HANDLER =================
app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(err.stack);

    res.status(
      err.status || 500
    ).json({
      success: false,

      message:
        err.message ||
        'Internal Server Error',

      status:
        err.status || 500,
    });
  }
);

// ================= START SERVER =================
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 BudgetWise server running on port ${PORT}`
  );

  console.log(
    `🌍 Environment: ${
      process.env.NODE_ENV ||
      'development'
    }`
  );
});