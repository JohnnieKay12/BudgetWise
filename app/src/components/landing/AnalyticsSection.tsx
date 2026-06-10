import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target, PiggyBank, CreditCard } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', amount: 85000 },
  { month: 'Feb', amount: 72000 },
  { month: 'Mar', amount: 95000 },
  { month: 'Apr', amount: 68000 },
  { month: 'May', amount: 110000 },
  { month: 'Jun', amount: 78000 },
];

const categoryData = [
  { name: 'Food & Jollof', value: 45000, color: '#009B40' },
  { name: 'Transport', value: 28500, color: '#924FFF' },
  { name: 'Data/Airtime', value: 18000, color: '#F7A21B' },
  { name: 'Rent', value: 150000, color: '#333333' },
  { name: 'Others', value: 22500, color: '#A9A9A9' },
];

const budgetData = [
  { category: 'Food', budget: 60000, spent: 45000 },
  { category: 'Trans', budget: 40000, spent: 28500 },
  { category: 'Data', budget: 25000, spent: 18000 },
  { category: 'Fuel', budget: 50000, spent: 42000 },
  { category: 'Misc', budget: 30000, spent: 22500 },
];

const stats = [
  { label: 'Total Spent', value: '₦284,500', change: '+12%', up: true, icon: CreditCard },
  { label: 'Budget Left', value: '₦85,500', change: '23 days', up: true, icon: Wallet },
  { label: 'Savings', value: '₦125,000', change: '+8%', up: true, icon: PiggyBank },
  { label: 'Goals', value: '3 of 5', change: '60%', up: true, icon: Target },
];

export default function AnalyticsSection() {
  return (
    <section id="analytics" className="section-padding bg-sage-50/50">
      <div className="container-default">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium mb-4">
            Analytics
          </span>
          <h2 className="text-3xl lg:text-display-lg font-display text-brand-black mb-4">
            Beautiful Insights, <br className="hidden lg:block" />Real Data
          </h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Visualize your spending patterns, track budget utilization, and monitor savings progress 
            with stunning charts that make your money make sense.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-brand-muted" />
                <span className={`text-xs font-medium flex items-center gap-1 ${stat.up ? 'text-brand-green' : 'text-brand-error'}`}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-display font-semibold text-brand-black">{stat.value}</p>
              <p className="text-xs text-brand-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Spending Trend */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-display font-medium text-brand-black">Monthly Spending Trend</h4>
              <span className="text-xs text-brand-muted bg-gray-100 px-2 py-1 rounded-md">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009B40" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#009B40" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#858585' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#858585' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Spent']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#009B40"
                  strokeWidth={2.5}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-display font-medium text-brand-black">Spending by Category</h4>
              <span className="text-xs text-brand-muted bg-gray-100 px-2 py-1 rounded-md">This Month</span>
            </div>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `₦${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #eee',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-brand-muted flex-1">{cat.name}</span>
                    <span className="text-xs font-medium text-brand-black">₦{(cat.value/1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Budget vs Actual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-display font-medium text-brand-black">Budget vs Actual Spending</h4>
              <span className="text-xs text-brand-muted bg-gray-100 px-2 py-1 rounded-md">Current Period</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={budgetData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#858585' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#858585' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => `₦${value.toLocaleString()}`}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                />
                <Bar dataKey="budget" fill="#A9A9A9" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="spent" fill="#009B40" radius={[4, 4, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
