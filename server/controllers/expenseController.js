const mongoose = require('mongoose');

const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// ================= GET MONTH STRING =================
const getMonthString = (date) => {
  const d = new Date(date);

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}`;
};

// ================= UPDATE BUDGET SPENT =================
const updateBudgetSpent = async (
  userId,
  category,
  month
) => {
  try {
    const budget = await Budget.findOne({
      user: new mongoose.Types.ObjectId(
        userId
      ),
      category,
      month,
    });

    // ================= NO BUDGET =================
    if (!budget) return;

    // ================= GET MONTH EXPENSES =================
    const expenses = await Expense.find({
      user: new mongoose.Types.ObjectId(
        userId
      ),
      category,
      month,
    });

    const totalSpent = expenses.reduce(
      (sum, exp) =>
        sum + Number(exp.amount || 0),
      0
    );

    budget.spent = totalSpent;

    await budget.save();
  } catch (error) {
    console.error(
      'Budget update error:',
      error
    );
  }
};

// ================= GET ALL EXPENSES =================
exports.getExpenses = async (req, res) => {
  try {
    const { month, category } =
      req.query;

    const query = {
      user: new mongoose.Types.ObjectId(
        req.user.id
      ),
    };

    // ================= FILTER BY MONTH =================
    if (
      month &&
      month !== 'undefined'
    ) {
      query.month = month;
    }

    // ================= FILTER BY CATEGORY =================
    if (
      category &&
      category !== 'All'
    ) {
      query.category = category;
    }

    const expenses = await Expense.find(
      query
    ).sort({
      date: -1,
      createdAt: -1,
    });

    res.json(expenses);
  } catch (error) {
    console.error(
      'GET EXPENSES ERROR:',
      error
    );

    res.status(500).json({
      message:
        'Failed to load expenses',
    });
  }
};

// ================= CREATE EXPENSE =================
exports.createExpense = async (
  req,
  res
) => {
  try {
    const {
      amount,
      description,
      category,
      date,
      note,
    } = req.body;

    const expenseDate = date
      ? new Date(date)
      : new Date();

    const month =
      getMonthString(expenseDate);

    const {
      createNotification,
    } = require('./notificationController');

    const expense = await Expense.create({
      user: req.user.id,

      amount: Number(amount),

      description,

      category,

      date: expenseDate,

      note,

      month,
    });

    // ================= UPDATE MONTHLY BUDGET =================
    await updateBudgetSpent(
      req.user.id,
      category,
      month
    );

    // ================= CREATE NOTIFICATION =================
    await createNotification(
      req.user.id,
      'New Expense Added',
      `₦${expense.amount} added to ${expense.category}`,
      'success'
    );

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= UPDATE EXPENSE =================
exports.updateExpense = async (
  req,
  res
) => {
  try {
    const oldExpense =
      await Expense.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!oldExpense) {
      return res.status(404).json({
        message: 'Expense not found.',
      });
    }

    const updatedDate =
      req.body.date ||
      oldExpense.date;

    const updatedMonth =
      getMonthString(updatedDate);

    const expense =
      await Expense.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        {
          ...req.body,

          amount: Number(
            req.body.amount
          ),

          month: updatedMonth,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    // ================= UPDATE OLD BUDGET =================
    await updateBudgetSpent(
      req.user.id,
      oldExpense.category,
      oldExpense.month
    );

    // ================= UPDATE NEW BUDGET =================
    await updateBudgetSpent(
      req.user.id,
      expense.category,
      expense.month
    );

    res.json(expense);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= DELETE EXPENSE =================
exports.deleteExpense = async (
  req,
  res
) => {
  try {
    const expense =
      await Expense.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!expense) {
      return res.status(404).json({
        message: 'Expense not found.',
      });
    }

    // ================= UPDATE BUDGET =================
    await updateBudgetSpent(
      req.user.id,
      expense.category,
      expense.month
    );

    res.json({
      success: true,
      message: 'Expense deleted.',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};