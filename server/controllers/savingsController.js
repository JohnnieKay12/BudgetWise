const SavingsGoal = require('../models/SavingsGoal');

// ================= GET ALL SAVINGS GOALS =================
exports.getSavingsGoals = async (req, res) => {
  try {
    const { month, status } = req.query;

    let query = {
      user: req.user.id,
    };

    // FILTER BY STATUS
    if (status) {
      query.status = status;
    }

    // FILTER BY MONTH
    if (month) {
      query.month = month;
    }

    const goals = await SavingsGoal.find(query).sort({
      createdAt: -1,
    });

    // ADD PROGRESS %
    const goalsWithProgress = goals.map((goal) => {
      const progress =
        goal.targetAmount > 0
          ? Math.min(
              100,
              Math.round(
                (goal.currentAmount /
                  goal.targetAmount) *
                  100
              )
            )
          : 0;

      return {
        ...goal.toObject(),
        progress,
        remainingAmount: Math.max(
          0,
          goal.targetAmount -
            goal.currentAmount
        ),
      };
    });

    res.json(goalsWithProgress);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= CREATE SAVINGS GOAL =================
exports.createSavingsGoal = async (
  req,
  res
) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      deadline,
      category,
      status,
      month,
      year,
    } = req.body;

    const now = new Date();

    const goal =
      await SavingsGoal.create({
        user: req.user.id,

        name,

        targetAmount:
          Number(targetAmount),

        currentAmount:
          Number(currentAmount || 0),

        deadline,

        category:
          category || 'General',

        status:
          status || 'active',

        month:
          month ||
          `${now.getFullYear()}-${String(
            now.getMonth() + 1
          ).padStart(2, '0')}`,

        year:
          year || now.getFullYear(),
      });

    res.status(201).json(goal);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= UPDATE SAVINGS GOAL =================
exports.updateSavingsGoal = async (
  req,
  res
) => {
  try {
    const existingGoal =
      await SavingsGoal.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!existingGoal) {
      return res.status(404).json({
        message:
          'Savings goal not found.',
      });
    }

    const updatedData = {
      ...req.body,
    };

    // FORCE NUMBERS
    if (req.body.targetAmount) {
      updatedData.targetAmount =
        Number(req.body.targetAmount);
    }

    if (req.body.currentAmount) {
      updatedData.currentAmount =
        Number(req.body.currentAmount);
    }

    // AUTO COMPLETE
    if (
      updatedData.currentAmount >=
      updatedData.targetAmount
    ) {
      updatedData.status =
        'completed';
    }

    const goal =
      await SavingsGoal.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.json(goal);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= DELETE SAVINGS GOAL =================
exports.deleteSavingsGoal = async (
  req,
  res
) => {
  try {
    const goal =
      await SavingsGoal.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!goal) {
      return res.status(404).json({
        message:
          'Savings goal not found.',
      });
    }

    res.json({
      success: true,
      message:
        'Savings goal deleted successfully.',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};