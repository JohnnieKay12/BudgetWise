const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const FinancialInsight = require('../models/FinancialInsight');


// ================= CURRENT MONTH HELPER =================
const getCurrentMonth = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}`;
};

// ================= GET DASHBOARD STATS =================
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // const now = new Date();

    const currentMonth =
    req.query.month || getCurrentMonth();

    // const startOfMonth = new Date(
    //   now.getFullYear(),
    //   now.getMonth(),
    //   1
    // );

    const expenses = await Expense.find({
      user: userId,
      month: currentMonth,
    });

    const totalExpenses = expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

    const monthlyExpenses = expenses;

    const monthlySpending =
      monthlyExpenses.reduce(
        (sum, expense) =>
          sum + Number(expense.amount || 0),
        0
      );

    const budgets = await Budget.find({
      user: userId,
      month: currentMonth,
    });

    const totalBudgetLimit = budgets.reduce(
      (sum, budget) =>
        sum + Number(budget.limit || 0),
      0
    );

    const budgetCategories = budgets.map(
      budget => budget.category
    );

    const totalBudgetSpent =
      monthlyExpenses
        .filter(expense =>
          budgetCategories.includes(
            expense.category
          )
        )
        .reduce(
          (sum, expense) =>
            sum + Number(expense.amount || 0),
          0
        );

    const budgetRemaining = Math.max(
      0,
      totalBudgetLimit - totalBudgetSpent
    );

    const goals = await SavingsGoal.find({
      user: userId,
    });

    const totalTarget = goals.reduce(
      (sum, goal) =>
        sum +
        Number(goal.targetAmount || 0),
      0
    );

    const totalSaved = goals.reduce(
      (sum, goal) =>
        sum +
        Number(goal.currentAmount || 0),
      0
    );

    const savingsProgress =
      totalTarget > 0
        ? Math.round(
            (totalSaved / totalTarget) *
              100
          )
        : 0;

    const budgetAdherence =
      totalBudgetLimit > 0
        ? Math.max(
            0,
            1 -
              totalBudgetSpent /
                totalBudgetLimit
          )
        : 0;

    const savingsConsistency =
      totalTarget > 0
        ? totalSaved / totalTarget
        : 0;

    const trackingFrequency =
      Math.min(
        1,
        monthlyExpenses.length / 20
      );

    const categories = new Set(
      expenses.map(
        expense => expense.category
      )
    );

    const categoryDiversification =
      Math.min(
        1,
        categories.size / 12
      );

    res.json({
      totalExpenses,
      monthlySpending,
      budgetRemaining,
      savingsProgress,

      expenseChange:
        totalExpenses > 0 ? 12 : 0,

      spendingChange:
        monthlySpending > 0 ? -5 : 0,

      budgetChange:
        budgetRemaining > 0 ? 8 : 0,

      savingsChange:
        savingsProgress > 0 ? 8 : 0,

      budgetAdherence:
        Math.round(
          budgetAdherence * 100
        ),

      savingsConsistency:
        Math.round(
          savingsConsistency * 100
        ),

      trackingFrequency:
        Math.round(
          trackingFrequency * 100
        ),

      categoryDiversification:
        Math.round(
          categoryDiversification * 100
        ),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET AI INSIGHTS =================
exports.getInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentMonth =
    req.query.month || getCurrentMonth();

    const expenses = await Expense.find({
      user: userId,
      month: currentMonth,
    }).sort({ date: -1 });

    const insights = [];


    // ================= NO EXPENSE DATA =================
    if (expenses.length === 0) {
      return res.json([]);
    }
    // ================= CATEGORY ANALYSIS =================
    const categoryTotals = {};

    expenses.forEach((expense) => {
      const category = expense.category;

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(expense.amount);
    });

    // TOP CATEGORY
    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (topCategory) {
      insights.push({
        title: `${topCategory[0]} Spending`,
        description: `You spend most of your money on ${topCategory[0]}. Total spent: ₦${Number(
          topCategory[1]
        ).toLocaleString()}.`,
        impact: 'warning',
      });
    }

    // ================= TRACKING HABIT =================
    if (expenses.length >= 10) {
      insights.push({
        title: 'Great Tracking Habit',
        description:
          'You are consistently tracking your expenses. Keep it up.',
        impact: 'positive',
      });
    } else {
      insights.push({
        title: 'Track More Expenses',
        description:
          'Adding expenses regularly improves your financial awareness.',
        impact: 'neutral',
      });
    }

    // ================= RECENT SPENDING =================
    const recentExpenses = expenses.slice(0, 5);

    const recentTotal = recentExpenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

    if (recentTotal > 50000) {
      insights.push({
        title: 'High Recent Spending',
        description:
          'Your recent spending is quite high. Consider reducing unnecessary expenses.',
        impact: 'warning',
      });
    } else {
      insights.push({
        title: 'Controlled Spending',
        description:
          'Your recent spending looks manageable.',
        impact: 'positive',
      });
    }

    const budgets = await Budget.find({
      user: userId,
      month: currentMonth,
    });
    
    budgets.forEach((budget) => {
      const categorySpent = expenses
        .filter(
          expense =>
            expense.category === budget.category
        )
        .reduce(
          (sum, expense) =>
            sum + Number(expense.amount || 0),
          0
        );
    
      if (
        budget.limit > 0 &&
        categorySpent >= budget.limit * 0.9
      ) {
        insights.push({
          title: 'Budget Alert',
          description: `You have used over 90% of your ${budget.category} budget.`,
          impact: 'warning',
        });
      }
    });

    res.json(insights.slice(0, 3));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET SOFT LIFE SCORE =================
exports.getSoftLifeScore = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const currentMonth =
    req.query.month || getCurrentMonth();

    // ONLY CURRENT MONTH EXPENSES
    const expenses = await Expense.find({
      user: userId,
      month: currentMonth,
    });

    const budgets = await Budget.find({
      user: userId,
      month: currentMonth,
    });

    const goals = await SavingsGoal.find({
      user: userId,
    });

    // ================= BUDGET SCORE =================
    const totalBudgetLimit = budgets.reduce(
      (sum, budget) =>
        sum + Number(budget.limit || 0),
      0
    );

    const budgetCategories =
      budgets.map(
        (budget) => budget.category
      );

    const totalBudgetSpent = expenses
      .filter((expense) =>
        budgetCategories.includes(
          expense.category
        )
      )
      .reduce(
        (sum, expense) =>
          sum +
          Number(expense.amount || 0),
        0
      );

    const budgetAdherence =
      totalBudgetLimit > 0
        ? Math.max(
            0,
            1 -
              totalBudgetSpent /
                totalBudgetLimit
          )
        : 0;

    // ================= SAVINGS SCORE =================
    const totalTarget = goals.reduce(
      (sum, goal) =>
        sum +
        Number(goal.targetAmount || 0),
      0
    );

    const totalSaved = goals.reduce(
      (sum, goal) =>
        sum +
        Number(goal.currentAmount || 0),
      0
    );

    const savingsConsistency =
      totalTarget > 0
        ? totalSaved / totalTarget
        : 0;

    // ================= TRACKING SCORE =================
    const trackingFrequency =
      Math.min(
        1,
        expenses.length / 20
      );

    // ================= CATEGORY SCORE =================
    const categories = new Set(
      expenses.map(
        (expense) => expense.category
      )
    );

    const categoryDiversification =
      Math.min(
        1,
        categories.size / 12
      );

    // ================= FINAL SCORE =================
    const score = Math.min(
      100,
      Math.round(
        (
          budgetAdherence +
          savingsConsistency +
          trackingFrequency +
          categoryDiversification
        ) * 25
      )
    );

    res.json({
      score,

      budgetAdherence:
        Math.round(
          budgetAdherence * 100
        ),

      savingsConsistency:
        Math.round(
          savingsConsistency * 100
        ),

      trackingFrequency:
        Math.round(
          trackingFrequency * 100
        ),

      categoryDiversification:
        Math.round(
          categoryDiversification * 100
        ),
    });
  } catch (error) {
    console.error(
      'SOFT LIFE SCORE ERROR:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET SAVINGS CHALLENGES =================
exports.getChallenges = async (
  req,
  res
) => {
  try {
    const SavingsChallenge = require('../models/SavingsChallenge');

    const challenges =
      await SavingsChallenge.find({
        status: 'active',
      })
        .sort({ createdAt: -1 })
        .limit(5);

        if (challenges.length === 0) {
          return res.json([]);
        }

    res.json(challenges);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};