const axios = require('axios');
const User = require('../models/User');
const Payment = require('../models/Payment');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = 'https://api.paystack.co';

// @desc    Initialize payment
// @route   POST /api/payments/initialize
// @access  Private
exports.initializePayment = async (req, res) => {
  try {
    const user = req.user;

    const { amount } = req.body;

    // Create payment reference
    const reference = `BW_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Store pending payment
    await Payment.create({
      user: user.id,
      reference,
      amount,
      status: 'pending',
    });

    // Paystack initialization
    if (
      PAYSTACK_SECRET &&
      !PAYSTACK_SECRET.includes('your_')
    ) {
      try {
        const response = await axios.post(
          `${PAYSTACK_BASE}/transaction/initialize`,
          {
            email: user.email,
            amount: amount * 100,
            reference,

            callback_url: `${
              process.env.FRONTEND_URL ||
              'http://localhost:3000'
            }/payment-success?reference=${reference}`,
          },
          {
            headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return res.json({
          authorization_url:
            response.data.data.authorization_url,

          reference,
        });
      } catch (paystackError) {
        console.error(
          'Paystack API error:',
          paystackError.message
        );
      }
    }

    // Fallback
    res.json({
      authorization_url: null,
      reference,
    });
  } catch (error) {
    console.error(
      'Initialize payment error:',
      error
    );

    res.status(500).json({
      message:
        error.message ||
        'Payment initialization failed.',
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify/:reference
// @access  Private
// @desc    Verify payment
// @route   POST /api/payments/verify/:reference
// @access  Public
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    let paymentStatus = 'success';
    let paystackData = {};

    // VERIFY PAYMENT FROM PAYSTACK
    if (
      PAYSTACK_SECRET &&
      !PAYSTACK_SECRET.includes('your_')
    ) {
      try {
        const response = await axios.get(
          `${PAYSTACK_BASE}/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET}`,
            },
          }
        );

        paystackData = response.data.data;

        console.log(
          'PAYSTACK VERIFY DATA:',
          paystackData
        );

        paymentStatus =
          paystackData.status === 'success'
            ? 'success'
            : 'failed';
      } catch (verifyError) {
        console.error(
          'Paystack verification error:',
          verifyError.response?.data ||
            verifyError.message
        );

        return res.status(500).json({
          success: false,
          message: 'Paystack verification failed',
        });
      }
    }

    // PAYMENT FAILED
    if (paymentStatus !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful',
      });
    }

    // UPDATE PAYMENT RECORD
    await Payment.findOneAndUpdate(
      { reference },
      {
        status: 'success',
        paystackResponse: paystackData,
      }
    );

    const now = new Date();

    const endDate = new Date(now);

    endDate.setMonth(now.getMonth() + 1);

    // GET CUSTOMER EMAIL
    const customerEmail =
    paystackData.customer?.email ||
    paystackData.metadata?.email;

    if (!customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'Customer email not found',
    });
    }

    // FIND USER
    let updatedUser = await User.findOne({
    email: customerEmail.toLowerCase(),
    });

    // USER MUST EXIST
    if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message:
        'User account not found. Please register first.',
    });
    }

    // ACTIVATE SUBSCRIPTION
    updatedUser.subscriptionStatus =
    'active';

    updatedUser.subscriptionPlan =
    'premium';

    updatedUser.subscriptionStartDate =
    now;

    updatedUser.subscriptionEndDate =
    endDate;

    updatedUser.lastPaymentDate = now;

    await updatedUser.save();

    // REMOVE PASSWORD
    const userResponse =
    updatedUser.toObject();

    delete userResponse.password;

    

    // GENERATE TOKEN
    const token = jwt.sign(
      { id: updatedUser._id },
      process.env.JWT_SECRET ||
        'budgetwise_secret_key',
      {
        expiresIn:
          process.env.JWT_EXPIRE || '24h',
      }
    );

    // SUCCESS RESPONSE
    res.json({
      success: true,
      message:
        'Payment verified successfully',

      token,

      user: userResponse,
    });
  } catch (error) {
    console.error(
      'VERIFY PAYMENT ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        'Payment verification failed',
    });
  }
};

// @desc    Renew subscription
// @route   POST /api/payments/renew
// @access  Private
exports.renewSubscription = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = req.user;

    const reference = `BW_RENEW_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    await Payment.create({
      user: user.id,
      reference,
      amount,
      status: 'pending',
    });

    if (
      PAYSTACK_SECRET &&
      !PAYSTACK_SECRET.includes('your_')
    ) {
      try {
        const response = await axios.post(
          `${PAYSTACK_BASE}/transaction/initialize`,
          {
            email: user.email,
            amount: amount * 100,
            reference,
          
            callback_url: `${
              process.env.FRONTEND_URL ||
              'http://localhost:3000'
            }/payment-success?reference=${reference}`,
          },
          {
            headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return res.json({
          authorization_url:
            response.data.data.authorization_url,

          reference,
        });
      } catch (error) {
        console.error(
          'Renewal Paystack error:',
          error.message
        );
      }
    }

    res.json({
      authorization_url: null,
      reference,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments =
      await Payment.find({
        user: req.user.id,
        status: 'success',
      }).sort({
        transactionDate: -1,
      });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};