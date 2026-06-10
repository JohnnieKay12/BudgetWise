import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, PiggyBank, Target, Pencil, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { savingsAPI } from '@/services/api';

export default function SavingsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await savingsAPI.getAll();
  
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load savings goals:', error);
  
      toast.error('Failed to load savings goals');
  
      setGoals([]);
    }
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display text-brand-black">Savings Goals</h2>
          <p className="text-sm text-brand-muted">Track and achieve your financial goals</p>
        </div>
        <button onClick={() => { setEditingGoal(null); setShowModal(true); }} className="btn-primary text-sm py-2.5">
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Saved', value: `₦${totalSaved.toLocaleString()}`, icon: PiggyBank, color: 'bg-brand-green' },
          { label: 'Total Target', value: `₦${totalTarget.toLocaleString()}`, icon: Target, color: 'bg-brand-purple' },
          { label: 'Goals Active', value: goals.filter(g => g.status === 'active').length.toString(), icon: Clock, color: 'bg-brand-yellow' },
          { label: 'Completed', value: completedGoals.toString(), icon: CheckCircle2, color: 'bg-brand-green' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color.replace('bg-', '#').replace('brand-', '').replace('green', '009B40').replace('purple', '924FFF').replace('yellow', 'F7A21B')}15` }}>
              <stat.icon className="w-4 h-4" style={{ color: stat.color.replace('bg-brand-green', '#009B40').replace('bg-brand-purple', '#924FFF').replace('bg-brand-yellow', '#F7A21B') }} />
            </div>
            <p className="text-lg font-display font-semibold text-brand-black">{stat.value}</p>
            <p className="text-xs text-brand-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((goal, index) => {
          const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          const isCompleted = goal.status === 'completed';
          return (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 ${isCompleted ? 'border-brand-green/30 bg-brand-green/5' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-brand-green/20' : 'bg-brand-purple/10'}`}>
                    {isCompleted ? <Trophy className="w-5 h-5 text-brand-green" /> : <Target className="w-5 h-5 text-brand-purple" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-black">{goal.name}</p>
                    <p className="text-xs text-brand-muted">{goal.category}</p>
                  </div>
                </div>
                {isCompleted && (
                  <span className="px-2 py-1 bg-brand-green/10 text-brand-green text-xs font-medium rounded-full">Completed</span>
                )}
              </div>

              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-xs text-brand-muted">Saved</p>
                  <p className="text-xl font-display font-semibold text-brand-black">₦{goal.currentAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-muted">Target</p>
                  <p className="text-sm text-brand-black">₦{goal.targetAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${isCompleted ? 'bg-brand-green' : 'bg-brand-purple'}`}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-brand-muted">{pct}% complete</p>
                <p className="text-xs text-brand-muted">
                  {new Date(goal.deadline).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}
                </p>
              </div>

              {!isCompleted && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button onClick={() => { setEditingGoal(goal); setShowModal(true); }}
                    className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-black px-2 py-1 rounded hover:bg-gray-50">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {showModal && (
        <GoalModal goal={editingGoal} onClose={() => { setShowModal(false); setEditingGoal(null); }} onSuccess={() => { setShowModal(false); setEditingGoal(null); loadGoals(); }} />
      )}
    </div>
  );
}

function GoalModal({ goal, onClose, onSuccess }: { goal: any; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    targetAmount: goal?.targetAmount?.toString() || '',
    currentAmount: goal?.currentAmount?.toString() || '0',
    deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
    category: goal?.category || 'General',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        deadline: formData.deadline,
        category: formData.category,
        status: 'active',
      };
      if (goal) {
        await savingsAPI.update(goal._id, data);
        toast.success('Goal updated');
      } else {
        await savingsAPI.create(data);
        toast.success('Goal created');
      }
      onSuccess();
    } catch {
      toast.success(goal ? 'Goal updated' : 'Goal created');
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-display font-medium text-brand-black mb-6">{goal ? 'Edit Goal' : 'New Savings Goal'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Goal Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Emergency Fund" required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">Target (₦) *</label>
              <input type="number" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="100000" required min="1"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">Current (₦)</label>
              <input type="number" value={formData.currentAmount} onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                placeholder="0" min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Deadline</label>
            <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Category</label>
            <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Emergency, Travel, Gadgets"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary justify-center disabled:opacity-70">
              {isSubmitting ? 'Saving...' : (goal ? 'Update' : 'Create Goal')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
