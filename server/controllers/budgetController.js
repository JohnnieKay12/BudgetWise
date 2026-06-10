const mongoose = require('mongoose');

const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// ================= GET MONTH STRING =================
const getMonthString = (date) => {
  const d = new Date(date);

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}`;
};

// ================= GET ALL BUDGETS =================
exports.getBudgets = async (req, res) => {
  try {
    const { month } = req.query;

    let query = {
      user: new mongoose.Types.ObjectId(
        req.user.id
      ),
    };

    // ================= FILTER BY MONTH =================
    if (month) {
      query.month = month;
    }

    const budgets = await Budget.find(query).sort({
      createdAt: -1,
    });

    const budgetsWithSpending =
      await Promise.all(
        budgets.map(async (budget) => {
          // ================= MATCH SAME MONTH EXPENSES =================
          const expenses =
            await Expense.find({
              user: new mongoose.Types.ObjectId(
                req.user.id
              ),

              category: budget.category,

              month: budget.month,
            });

          // ================= TOTAL SPENT =================
          const spent = expenses.reduce(
            (total, expense) =>
              total +
              Number(expense.amount || 0),
            0
          );

          // ================= REMAINING =================
          const remaining = Math.max(
            0,
            Number(budget.limit || 0) - spent
          );

          // ================= PERCENTAGE =================
          const percentage =
            Number(budget.limit) > 0
              ? Math.min(
                  Math.round(
                    (spent /
                      Number(budget.limit)) *
                      100
                  ),
                  100
                )
              : 0;

          return {
            ...budget.toObject(),

            spent,

            remaining,

            percentage,
          };
        })
      );

    res.json(budgetsWithSpending);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= CREATE BUDGET =================
exports.createBudget = async (req, res) => {
  try {
    const {
      category,
      limit,
      startDate,
      endDate,
      period,
      month,
    } = req.body;

    // ================= GENERATE MONTH =================
    const budgetDate = month
      ? new Date(`${month}-01`)
      : startDate
      ? new Date(startDate)
      : new Date();

    const finalMonth =
      month || getMonthString(budgetDate);

    // ================= CHECK EXISTING =================
    const existingBudget =
      await Budget.findOne({
        user: req.user.id,
        category,
        month: finalMonth,
      });

    if (existingBudget) {
      return res.status(400).json({
        message:
          'Budget already exists for this category this month.',
      });
    }

    // ================= GET CURRENT MONTH EXPENSES =================
    const expenses = await Expense.find({
      user: req.user.id,
      category,
      month: finalMonth,
    });

    const spent = expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

    // ================= CREATE BUDGET =================
    const budget = await Budget.create({
      user: req.user.id,

      category,

      limit,

      spent,

      period,

      month: finalMonth,

      startDate:
        startDate || budgetDate,

      endDate:
        endDate ||
        new Date(
          budgetDate.getFullYear(),
          budgetDate.getMonth() + 1,
          0
        ),
    });

    res.status(201).json(budget);
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= UPDATE BUDGET =================
exports.updateBudget = async (
  req,
  res
) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: 'Budget not found',
      });
    }

    // ================= UPDATE FIELDS =================
    budget.category =
      req.body.category || budget.category;

    budget.limit =
      req.body.limit || budget.limit;

    budget.period =
      req.body.period || budget.period;

    // ================= RECALCULATE SPENT =================
    const expenses = await Expense.find({
      user: req.user.id,
      category: budget.category,
      month: budget.month,
    });

    budget.spent = expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

    await budget.save();

    res.json(budget);
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= DELETE BUDGET =================
exports.deleteBudget = async (
  req,
  res
) => {
  try {
    const budget =
      await Budget.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!budget) {
      return res.status(404).json({
        message: 'Budget not found',
      });
    }

    res.json({
      success: true,
      message: 'Budget deleted',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};