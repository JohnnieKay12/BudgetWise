import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Receipt,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { toast } from 'sonner';
import { expenseAPI } from '@/services/api';

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

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Jollof': '#009B40',
  Transport: '#924FFF',
  'Bolt/Uber': '#924FFF',
  'Data Subscription': '#F7A21B',
  Airtime: '#F7A21B',
  'Generator Fuel': '#333333',
  'POS Charges': '#FF5252',
  'Family Support': '#009B40',
  'Church Offering': '#924FFF',
  Rent: '#333333',
  'NEPA Bills': '#F7A21B',
};

export default function ExpensesPage() {
  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [
    filteredExpenses,
    setFilteredExpenses,
  ] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('All');

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editingExpense, setEditingExpense] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  // ================= MONTH =================
  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  const getMonthString = (
    date: Date
  ) => {
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString(
      'en-US',
      {
        month: 'long',
        year: 'numeric',
      }
    );
  };

  // ================= LOAD EXPENSES =================
  useEffect(() => {
    loadExpenses();
  }, [currentMonth]);

  // ================= FILTER =================
  useEffect(() => {
    let filtered = [...expenses];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (expense) =>
          expense.description
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          expense.category
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (expense) =>
          expense.category ===
          selectedCategory
      );
    }

    setFilteredExpenses(filtered);
  }, [
    expenses,
    searchQuery,
    selectedCategory,
  ]);

  // ================= LOAD =================
  const loadExpenses = async () => {
    try {
      setLoading(true);

      const month =
        getMonthString(currentMonth);

        const response =
        await expenseAPI.getAll({
          month,
        });

        const expensesData = Array.isArray(response)
        ? response
        : (response as any)?.data || [];

      setExpenses(expensesData);

      setFilteredExpenses(expensesData);
    } catch (error: any) {
      console.log(error);

      setExpenses([]);
      setFilteredExpenses([]);

      toast.error(
        error?.response?.data?.message ||
          'Failed to load expenses'
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= MONTH NAVIGATION =================
  const previousMonth = () => {
    const newDate = new Date(
      currentMonth
    );

    newDate.setMonth(
      newDate.getMonth() - 1
    );

    setCurrentMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(
      currentMonth
    );

    newDate.setMonth(
      newDate.getMonth() + 1
    );

    setCurrentMonth(newDate);
  };

  // ================= DELETE =================
  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this expense?'
    );

    if (!confirmDelete) return;

    try {
      await expenseAPI.delete(id);

      const updatedExpenses =
        expenses.filter(
          (expense) =>
            expense._id !== id
        );

      setExpenses(updatedExpenses);

      toast.success(
        'Expense deleted successfully'
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Failed to delete expense'
      );
    }
  };

  // ================= EXPORT =================
  const exportExpenses = () => {
    if (filteredExpenses.length === 0) {
      toast.error(
        'No expenses available to export'
      );

      return;
    }

    const csvContent = [
      [
        'Description',
        'Category',
        'Amount',
        'Date',
      ].join(','),

      ...filteredExpenses.map(
        (expense) =>
          [
            expense.description,
            expense.category,
            expense.amount,
            new Date(
              expense.date
            ).toLocaleDateString(),
          ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.setAttribute(
      'download',
      'expenses.csv'
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    toast.success(
      'Expenses exported successfully'
    );
  };

  const totalAmount =
    filteredExpenses.reduce(
      (sum, expense) =>
        sum +
        Number(expense.amount || 0),
      0
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display text-brand-black">
            Expenses
          </h2>

          <p className="text-sm text-brand-muted">
            Track and manage your
            spending
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportExpenses}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium hover:bg-sage-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={() => {
              setEditingExpense(null);
              setShowAddModal(true);
            }}
            className="btn-primary text-sm py-2.5"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* MONTH SLIDER */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-display font-semibold text-brand-black">
              {formatMonth(
                currentMonth
              )}
            </h3>

            <p className="text-xs text-brand-muted">
              Monthly Expense Overview
            </p>
          </div>

          <button
            onClick={nextMonth}
            className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-muted">
              Total Expenses
            </p>

            <p className="text-3xl font-display font-semibold text-brand-black">
              ₦
              {totalAmount.toLocaleString()}
            </p>

            <p className="text-sm text-brand-muted mt-1">
              {
                filteredExpenses.length
              }{' '}
              expense
              {filteredExpenses.length !==
              1
                ? 's'
                : ''}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <Receipt className="w-6 h-6 text-brand-green" />
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
            className="pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm appearance-none"
          >
            <option value="All">
              All Categories
            </option>

            {NIGERIAN_CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* LIST */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            Loading expenses...
          </div>
        ) : filteredExpenses.length ===
          0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-brand-muted/30 mx-auto mb-4" />

            <p className="text-brand-muted font-medium">
              No expenses found
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredExpenses.map(
              (expense, index) => (
                <motion.div
                  key={expense._id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-sage-50/30 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${
                        CATEGORY_COLORS[
                          expense.category
                        ] || '#009B40'
                      }15`,
                    }}
                  >
                    <Receipt
                      className="w-4 h-4"
                      style={{
                        color:
                          CATEGORY_COLORS[
                            expense.category
                          ] || '#009B40',
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {
                        expense.description
                      }
                    </p>

                    <p className="text-sm text-brand-muted">
                      {
                        expense.category
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₦
                      {Number(
                        expense.amount
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingExpense(
                          expense
                        );

                        setShowAddModal(
                          true
                        );
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          expense._id
                        )
                      }
                      className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>
            {/* MODAL */}
            {showAddModal && (
              <ExpenseModal
                expense={editingExpense}
                currentMonth={currentMonth}
                onClose={() => {
                  setShowAddModal(false);
                  setEditingExpense(null);
                }}
                onSuccess={() => {
                  setShowAddModal(false);
                  setEditingExpense(null);
                  loadExpenses();
                }}
              />
      )}
    </div>
  );
}

function ExpenseModal({
  expense,
  currentMonth,
  onClose,
  onSuccess,
}: {
  expense: any;
  currentMonth: Date;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount?.toString() || '',
    category:
      expense?.category || NIGERIAN_CATEGORIES[0],
    date: expense?.date
      ? new Date(expense.date)
          .toISOString()
          .split('T')[0]
      : new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      )
          .toISOString()
          .split('T')[0],
    note: expense?.note || '',
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const payload = {
        description:
          formData.description.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        note: formData.note.trim(),
      };

      if (!payload.description) {
        toast.error(
          'Description is required'
        );
        return;
      }

      if (
        isNaN(payload.amount) ||
        payload.amount <= 0
      ) {
        toast.error(
          'Enter a valid amount'
        );
        return;
      }

      if (expense) {
        await expenseAPI.update(
          expense._id,
          payload
        );

        toast.success(
          'Expense updated successfully'
        );
      } else {
        await expenseAPI.create(payload);

        toast.success(
          'Expense added successfully'
        );
      }

      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Failed to save expense'
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
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
      >
        <h3 className="text-xl font-semibold mb-6">
          {expense
            ? 'Edit Expense'
            : 'Add Expense'}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          >
            {NIGERIAN_CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <textarea
            placeholder="Note"
            value={formData.note}
            onChange={(e) =>
              setFormData({
                ...formData,
                note: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary"
            >
              {isSubmitting
                ? 'Saving...'
                : expense
                ? 'Update'
                : 'Add Expense'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

