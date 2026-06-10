import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Target,
  AlertTriangle,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { toast } from 'sonner';
import { budgetAPI } from '@/services/api';

const NIGERIAN_CATEGORIES = [
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
];

const CATEGORY_COLORS: Record<
  string,
  string
> = {
  'Food & Jollof': '#009B40',

  Transport: '#924FFF',
  'Bolt/Uber': '#924FFF',

  'Data Subscription': '#F7A21B',
  Airtime: '#F7A21B',
  'NEPA Bills': '#F7A21B',

  'Generator Fuel': '#333333',
  Rent: '#333333',

  'POS Charges': '#FF5252',

  'Family Support': '#009B40',
  'Church Offering': '#924FFF',
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<
    any[]
  >([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editingBudget, setEditingBudget] =
    useState<any>(null);

  // ================= MONTH STATE =================
  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  const monthKey = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, '0')}`;

  // ================= LOAD BUDGETS =================
  useEffect(() => {
    loadBudgets();
  }, [monthKey]);

  const loadBudgets = async () => {
    try {
      const data =
        await budgetAPI.getAll(monthKey);

      setBudgets(data);
    } catch {
      setBudgets([]);
    }
  };

  // ================= TOTALS =================
  const totalBudget = budgets.reduce(
    (sum, budget) =>
      sum + Number(budget.limit || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (sum, budget) =>
      sum + Number(budget.spent || 0),
    0
  );

  const totalRemaining =
    totalBudget - totalSpent;

  // ================= UTILIZATION =================
  const getUtilization = (
    spent: number,
    limit: number
  ) => {
    const pct =
      limit > 0
        ? (spent / limit) * 100
        : 0;

    if (pct >= 90) {
      return {
        color: 'bg-brand-error',
        textColor:
          'text-brand-error',
        label: 'Critical',
      };
    }

    if (pct >= 75) {
      return {
        color: 'bg-brand-yellow',
        textColor:
          'text-brand-yellow',
        label: 'Warning',
      };
    }

    return {
      color: 'bg-brand-green',
      textColor: 'text-brand-green',
      label: 'On Track',
    };
  };

  // ================= MONTH NAVIGATION =================
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display text-brand-black">
            Budgets
          </h2>

          <p className="text-sm text-brand-muted">
            Set and track your monthly
            spending limits
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBudget(null);
            setShowModal(true);
          }}
          className="btn-primary text-sm py-2.5"
        >
          <Plus className="w-4 h-4" />
          Create Budget
        </button>
      </div>

      {/* ================= MONTH SWITCHER ================= */}
      <div className="glass-card p-4 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-lg font-display font-semibold text-brand-black">
            {currentMonth.toLocaleString(
              'default',
              {
                month: 'long',
                year: 'numeric',
              }
            )}
          </p>

          <p className="text-xs text-brand-muted">
            Monthly Budget Overview
          </p>
        </div>

        <button
          onClick={goToNextMonth}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* TOTAL BUDGET */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-green" />
            </div>

            <div>
              <p className="text-xs text-brand-muted">
                Total Budget
              </p>

              <p className="text-xl font-display font-semibold text-brand-black">
                ₦
                {totalBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* TOTAL SPENT */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-purple" />
            </div>

            <div>
              <p className="text-xs text-brand-muted">
                Total Spent
              </p>

              <p className="text-xl font-display font-semibold text-brand-black">
                ₦
                {totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* REMAINING */}
        <div className="glass-card p-5 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-green" />
            </div>

            <div>
              <p className="text-xs text-brand-muted">
                Remaining
              </p>

              <p className="text-xl font-display font-semibold text-brand-green">
                ₦
                {totalRemaining.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= OVERALL PROGRESS ================= */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-brand-black">
            Overall Utilization
          </span>

          <span
            className={`text-sm font-medium ${
              getUtilization(
                totalSpent,
                totalBudget
              ).textColor
            }`}
          >
            {totalBudget > 0
              ? Math.round(
                  (totalSpent /
                    totalBudget) *
                    100
                )
              : 0}
            %
          </span>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                totalBudget > 0
                  ? Math.min(
                      (totalSpent /
                        totalBudget) *
                        100,
                      100
                    )
                  : 0
              }%`,
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
            className={`h-full rounded-full ${
              getUtilization(
                totalSpent,
                totalBudget
              ).color
            }`}
          />
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {budgets.length === 0 && (
        <div className="glass-card p-10 text-center">
          <Target className="w-12 h-12 mx-auto text-brand-muted mb-4" />

          <h3 className="text-lg font-display text-brand-black mb-2">
            No Budgets Yet
          </h3>

          <p className="text-sm text-brand-muted mb-6">
            Create budgets for this
            month to start tracking your
            spending.
          </p>

          <button
            onClick={() => {
              setEditingBudget(null);
              setShowModal(true);
            }}
            className="btn-primary"
          >
            Create Budget
          </button>
        </div>
      )}

      {/* ================= BUDGET CARDS ================= */}
      <div className="grid md:grid-cols-2 gap-4">
        {budgets.map((budget, index) => {
          const util = getUtilization(
            budget.spent,
            budget.limit
          );

          const pct =
            budget.limit > 0
              ? Math.round(
                  (budget.spent /
                    budget.limit) *
                    100
                )
              : 0;

          return (
            <motion.div
              key={budget._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="glass-card p-5 hover:shadow-card-hover transition-shadow"
            >
              {/* TOP */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${
                        CATEGORY_COLORS[
                          budget.category
                        ] || '#009B40'
                      }15`,
                    }}
                  >
                    <Target
                      className="w-5 h-5"
                      style={{
                        color:
                          CATEGORY_COLORS[
                            budget.category
                          ] || '#009B40',
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-brand-black">
                      {budget.category}
                    </p>

                    <p className="text-xs text-brand-muted capitalize">
                      {budget.period}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {pct >= 90 && (
                    <AlertTriangle className="w-4 h-4 text-brand-error" />
                  )}

                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${util.textColor}`}
                    style={{
                      backgroundColor:
                        pct >= 90
                          ? '#FF525215'
                          : pct >= 75
                          ? '#F7A21B15'
                          : '#009B4015',
                    }}
                  >
                    {util.label}
                  </span>
                </div>
              </div>

              {/* VALUES */}
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-xs text-brand-muted">
                    Spent
                  </p>

                  <p className="text-lg font-display font-semibold text-brand-black">
                    ₦
                    {Number(
                      budget.spent || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-brand-muted">
                    Limit
                  </p>

                  <p className="text-sm text-brand-black">
                    ₦
                    {Number(
                      budget.limit || 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      pct,
                      100
                    )}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                  }}
                  className={`h-full rounded-full ${util.color}`}
                />
              </div>

              <p className="text-xs text-brand-muted mt-2">
                {pct}% utilized
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingBudget(
                      budget
                    );

                    setShowModal(true);
                  }}
                  className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-black px-2 py-1 rounded hover:bg-gray-50"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <BudgetModal
          monthKey={monthKey}
          budget={editingBudget}
          onClose={() => {
            setShowModal(false);
            setEditingBudget(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingBudget(null);

            loadBudgets();
          }}
        />
      )}
    </div>
  );
}

// ================= MODAL =================
function BudgetModal({
  budget,
  onClose,
  onSuccess,
  monthKey,
}: {
  budget: any;
  onClose: () => void;
  onSuccess: () => void;
  monthKey: string;
}) {
  const [formData, setFormData] =
    useState({
      category:
        budget?.category ||
        NIGERIAN_CATEGORIES[0],

      limit:
        budget?.limit?.toString() || '',

      period:
        budget?.period || 'monthly',
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const currentDate = new Date();

      const data = {
        category: formData.category,

        limit: parseFloat(
          formData.limit
        ),

        period: formData.period,

        month: monthKey,

        year:
          currentDate.getFullYear(),

        spent: 0,
      };

      if (budget) {
        await budgetAPI.update(
          budget._id,
          data
        );

        toast.success(
          'Budget updated'
        );
      } else {
        await budgetAPI.create(data);

        toast.success(
          'Budget created'
        );
      }

      onSuccess();
    } catch (error) {
      toast.error(
        'Failed to save budget'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-xl font-display font-medium text-brand-black mb-6">
          {budget
            ? 'Edit Budget'
            : 'Create Budget'}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Category
            </label>

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
            >
              {NIGERIAN_CATEGORIES.map(
                (cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                )
              )}
            </select>
          </div>

          {/* LIMIT */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Budget Limit (₦)
            </label>

            <input
              type="number"
              value={formData.limit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  limit:
                    e.target.value,
                })
              }
              placeholder="50000"
              required
              min="1"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            />
          </div>

          {/* PERIOD */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Period
            </label>

            <select
              value={formData.period}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  period:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
            >
              <option value="weekly">
                Weekly
              </option>

              <option value="monthly">
                Monthly
              </option>

              <option value="yearly">
                Yearly
              </option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary justify-center disabled:opacity-70"
            >
              {isSubmitting
                ? 'Saving...'
                : budget
                ? 'Update'
                : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}