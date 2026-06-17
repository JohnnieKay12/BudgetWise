import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  PiggyBank,
  CreditCard,
  Plus,
  Mic,
  Sparkles,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Zap,
  Lightbulb,
  AlertTriangle,
  X,
  RefreshCcw,
} from 'lucide-react';

import { toast } from 'sonner';

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { dashboardAPI, expenseAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// ================= COLORS =================
const COLORS = ['#009B40', '#924FFF', '#F7A21B', '#333333', '#A9A9A9', '#FF5252'];

// ================= CATEGORIES =================
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

// ================= TYPES =================
type Stats = {
  totalExpenses: number;
  monthlySpending: number;
  budgetRemaining: number;
  savingsProgress: number;
};

type Expense = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
};

type Insight = {
  title: string;
  description: string;
  impact: 'positive' | 'warning' | 'neutral';
};

// ================= COMPONENT =================
export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats>({
    totalExpenses: 0,
    monthlySpending: 0,
    budgetRemaining: 0,
    savingsProgress: 0,
  });
  

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  const [softLifeScore, setSoftLifeScore] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const recognitionRef = useRef<any>(null);

  // ================= LOAD DATA =================
  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth]);

  // Utility helper to create a small pause between API calls
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Stats
      const statsRes = await dashboardAPI.getStats(selectedMonth);
      await delay(100); // 100ms buffer to bypass Render's burst rate limiter

      // 2. Fetch Expenses (Pass selectedMonth to backend if supported!)
      // If your backend doesn't support query strings yet, change it back to expenseAPI.getAll()
      const expensesRes = await expenseAPI.getAll({ month: selectedMonth });
      await delay(100);

      // 3. Fetch Insights
      const insightsRes = await dashboardAPI.getInsights(selectedMonth);
      await delay(100);

      // 4. Fetch Soft Life Score
      const softLifeRes = await dashboardAPI.getSoftLifeScore(selectedMonth);

      // ================= STATS =================
      setStats({
        totalExpenses: Number(statsRes?.totalExpenses || 0),
        monthlySpending: Number(statsRes?.monthlySpending || 0),
        budgetRemaining: Number(statsRes?.budgetRemaining || 0),
        savingsProgress: Number(statsRes?.savingsProgress || 0),
      });

      // ================= INSIGHTS =================
      if (Array.isArray(insightsRes)) {
        setInsights(insightsRes.slice(0, 3));
      } else {
        setInsights([]);
      }

      // ================= EXPENSES =================
      const expenses: Expense[] = 
      Array.isArray(expensesRes) 
      ? expensesRes 
      : [];

      const filteredExpenses = expenses.filter((expense) => {
        const month = new Date(expense.date)
          .toISOString()
          .slice(0, 7);
        
        return month === selectedMonth;
      });

      // SORT NEWEST FIRST
      const sortedExpenses = [...filteredExpenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setRecentExpenses(sortedExpenses.slice(0, 5));

      // ================= MONTHLY DATA =================
      const monthMap: Record<string, number> = {};

      expenses.forEach((exp) => {
        const monthKey = new Date(exp.date)
        .toLocaleString('en-NG', {
          month: 'short',
          year: '2-digit',
        });

        monthMap[monthKey] =
          (monthMap[monthKey] || 0) +
          Number(exp.amount);
      });

      const trendData = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();

        date.setMonth(date.getMonth() - i);

        const month = date.toLocaleString(
          'en-NG',
          {
            month: 'short',
            year: '2-digit',
          }
        );

        trendData.push({
          month,
          amount: monthMap[month] || 0,
        });
      }

      setMonthlyData(trendData);

      // ================= CATEGORY DATA =================
      const categoryMap: Record<string, number> = {};

      sortedExpenses.forEach((exp) => {
        categoryMap[exp.category] =
          (categoryMap[exp.category] || 0) + Number(exp.amount);
      });

      setCategoryData(
        Object.entries(categoryMap)
          .map(([name, value]) => ({
            name,
            value,
          }))
          .sort((a, b) => Number(b.value) - Number(a.value))
          .slice(0, 5)
      );

      // ================= SOFT LIFE SCORE =================
      setSoftLifeScore(
        Number(softLifeRes?.score || 0)
      );
            
    } catch (error) {
      console.error(error);

      toast.error('Failed to load dashboard data');

      setMonthlyData([]);
      setCategoryData([]);
      setRecentExpenses([]);
      setInsights([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ================= REFRESH =================
  const refreshDashboard = async () => {
    setRefreshing(true);
    await loadDashboardData();
    toast.success('Dashboard refreshed');
  };

  // ================= VOICE ENTRY =================
  const handleVoiceEntry = () => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      toast.error('Voice recognition not supported');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-NG';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      toast.success(`Heard: "${transcript}"`);

      const amountMatch = transcript.match(/[\d,]+/);

      if (amountMatch) {
        toast.success(`Detected Amount: ₦${amountMatch[0]}`);
      }

      setIsListening(false);
    };

    recognition.onerror = () => {
      toast.error('Voice recognition failed');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // ================= SCORE HELPERS =================
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-brand-green';
    if (score >= 60) return 'text-brand-yellow';
    return 'text-brand-error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  // ================= STAT CARDS =================
  const statCards = useMemo(
    () => [
      {
        label: 'Total Expenses',
        value: `₦${stats.totalExpenses.toLocaleString()}`,
        change: '+12%',
        up: true,
        icon: CreditCard,
      },
      {
        label: new Date(selectedMonth + '-01').toLocaleString(
          'en-NG',
          {
            month: 'long',
            year: 'numeric',
          }
        ),
        value: `₦${stats.monthlySpending.toLocaleString()}`,
        change: 'Spent',
        up: false,
        icon: Wallet,
      },
      {
        label: 'Budget Left',
        value: `₦${stats.budgetRemaining.toLocaleString()}`,
        change: 'Active',
        up: true,
        icon: Target,
      },
      {
        label: 'Savings Progress',
        value: `${stats.savingsProgress}%`,
        change: '+8%',
        up: true,
        icon: PiggyBank,
      },
    ],
    [stats, selectedMonth]
  );

  // HELPERS

  const goToPreviousMonth = () => {
    const date = new Date(selectedMonth + '-01');
  
    date.setMonth(date.getMonth() - 1);
  
    setSelectedMonth(
      date.toISOString().slice(0, 7)
    );
  };
  
  const goToNextMonth = () => {
    const date = new Date(selectedMonth + '-01');
  
    date.setMonth(date.getMonth() + 1);
  
    setSelectedMonth(
      date.toISOString().slice(0, 7)
    );
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-brand-muted">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-semibold text-brand-black">
            Good{' '}
            {new Date().getHours() < 12
              ? 'Morning'
              : new Date().getHours() < 17
              ? 'Afternoon'
              : 'Evening'}
            , {user?.fullName?.split(' ')[0] || 'Friend'}
          </h1>

          <p className="text-sm text-brand-muted mt-1">
            Here is what is happening with your money today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <button
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-medium">
              {new Date(selectedMonth + '-01').toLocaleString(
                'en-NG',
                {
                  month: 'long',
                  year: 'numeric',
                }
              )}
            </span>

            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            onClick={refreshDashboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-sage-50 transition-all text-sm"
          >
            <RefreshCcw
              className={`w-4 h-4 ${
                refreshing ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </button>

          <button
            onClick={handleVoiceEntry}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isListening
                ? 'bg-brand-error text-white animate-pulse'
                : 'bg-white border border-gray-200 text-brand-black hover:bg-sage-50'
            }`}
          >
            <Mic className="w-4 h-4" />
            {isListening ? 'Listening...' : 'Voice Entry'}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="
              fixed bottom-6 right-6
              w-14 h-14
              rounded-full
              bg-brand-green
              text-white
              shadow-xl
              flex items-center justify-center
              hover:scale-105
              transition
              z-50
            "
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 rounded-2xl border border-gray-100 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-brand-green" />
              </div>

              <span
                className={`text-xs font-medium flex items-center gap-1 ${
                  stat.up
                    ? 'text-brand-green'
                    : 'text-brand-error'
                }`}
              >
                {stat.up ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>

            <p className="text-xl lg:text-2xl font-display font-semibold text-brand-black">
              {stat.value}
            </p>

            <p className="text-xs text-brand-muted mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-medium text-brand-black">
              Spending Trend
            </h3>

            <span className="text-xs text-brand-muted bg-sage-50 px-2 py-1 rounded-md">
              Last Months
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient
                  id="colorSpending"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#009B40"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="#009B40"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#858585' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: '#858585' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  `₦${(v / 1000).toFixed(0)}k`
                }
              />

              <Tooltip
                formatter={(value: number) => [
                  `₦${value.toLocaleString()}`,
                  'Spent',
                ]}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #eee',
                }}
              />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#009B40"
                strokeWidth={2.5}
                fill="url(#colorSpending)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-medium text-brand-black">
              By Category
            </h3>

            <span className="text-xs text-brand-muted bg-sage-50 px-2 py-1 rounded-md">
              Top Categories
            </span>
          </div>

          {categoryData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-brand-muted">
              No expense data yet
            </div>
          ) : (
            <div className="flex items-center">
              <ResponsiveContainer width="45%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value: number) =>
                      `₦${value.toLocaleString()}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex-1 space-y-3">
                {categoryData.map((cat, i) => (
                  <div
                    key={cat.name}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[i % COLORS.length],
                      }}
                    />

                    <span className="text-xs text-brand-muted flex-1">
                      {cat.name}
                    </span>

                    <span className="text-xs font-medium text-brand-black">
                      ₦{cat.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ================= BOTTOM GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-brand-purple" />

            <h3 className="font-display font-medium text-brand-black">
              AI Insights
            </h3>
          </div>

          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="text-sm text-brand-muted">
                No insights available yet.
              </div>
            ) : (
              insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-xl bg-sage-50/50"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      insight.impact === 'positive'
                        ? 'bg-brand-green/10'
                        : insight.impact === 'warning'
                        ? 'bg-brand-yellow/10'
                        : 'bg-brand-purple/10'
                    }`}
                  >
                    {insight.impact === 'positive' ? (
                      <Zap className="w-4 h-4 text-brand-green" />
                    ) : insight.impact === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-brand-yellow" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-brand-purple" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-brand-black">
                      {insight.title}
                    </p>

                    <p className="text-xs text-brand-muted mt-0.5">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Soft Life Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-brand-yellow" />

            <h3 className="font-display font-medium text-brand-black">
              Soft Life Score
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="10"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#009B40"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    50 *
                    (1 - softLifeScore / 100)
                  }`}
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-3xl font-display font-bold ${getScoreColor(
                    softLifeScore
                  )}`}
                >
                  {softLifeScore}
                </span>

                <span className="text-xs text-brand-muted">
                  /100
                </span>
              </div>
            </div>

            <p
              className={`text-sm font-medium ${getScoreColor(
                softLifeScore
              )} mb-1`}
            >
              {getScoreLabel(softLifeScore)}
            </p>

            <p className="text-xs text-brand-muted text-center mb-4">
              Based on budgeting, savings, and tracking habits
            </p>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-brand-green" />

              <h3 className="font-display font-medium text-brand-black">
                Recent
              </h3>
            </div>

            <button
              onClick={() =>
                (window.location.href =
                  '/dashboard/expenses')
              }
              className="text-xs text-brand-green font-medium flex items-center gap-1 hover:underline"
            >
              View All
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentExpenses.length === 0 ? (
              <div className="text-sm text-brand-muted">
                No expenses added yet.
              </div>
            ) : (
              recentExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-sage-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-4 h-4 text-brand-green" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">
                      {expense.description}
                    </p>

                    <p className="text-xs text-brand-muted">
                      {expense.category}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-brand-black">
                      ₦{Number(expense.amount).toLocaleString()}
                    </p>

                    <p className="text-xs text-brand-muted">
                      {new Date(expense.date).toLocaleDateString(
                        'en-NG',
                        {
                          day: 'numeric',
                          month: 'short',
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {showAddModal && (
          <AddExpenseModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              loadDashboardData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ================= ADD EXPENSE MODAL =================
function AddExpenseModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: NIGERIAN_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      await expenseAPI.create({
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        note: formData.note,
      });

      toast.success('Expense added successfully');

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-medium text-brand-black">
            Add Expense
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Description *
            </label>

            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="e.g. Lunch at Iya Basira"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
              required
            />
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Amount (₦) *
              </label>

              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value,
                  })
                }
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Category *
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
              >
                {NIGERIAN_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Date
            </label>

            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Note
            </label>

            <textarea
              rows={3}
              value={formData.note}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  note: e.target.value,
                })
              }
              placeholder="Additional details..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center py-3.5 disabled:opacity-70"
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}