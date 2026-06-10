import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  CalendarClock,
  Bell,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Pencil,
} from 'lucide-react';
import { toast } from 'sonner';
import { reminderAPI } from '@/services/api';

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

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderAPI.getAll();

      if (Array.isArray(data)) {
        setReminders(data);
      } else {
        setReminders([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load reminders');
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (id: string, currentStatus: boolean) => {
    try {
      await reminderAPI.update(id, {
        isActive: !currentStatus,
      });

      setReminders((prev) =>
        prev.map((r) =>
          r._id === id
            ? {
                ...r,
                isActive: !currentStatus,
              }
            : r
        )
      );

      toast.success(
        currentStatus
          ? 'Reminder paused'
          : 'Reminder activated'
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to update reminder');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reminder?')) return;

    try {
      await reminderAPI.delete(id);

      setReminders((prev) =>
        prev.filter((r) => r._id !== id)
      );

      toast.success('Reminder deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete reminder');
    }
  };

  const isOverdue = (date: string) =>
    new Date(date) < new Date() &&
    new Date(date).toDateString() !==
      new Date().toDateString();

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display text-brand-black">
            Reminders
          </h2>
          <p className="text-sm text-brand-muted">
            Never miss a payment or savings deposit
          </p>
        </div>

        <button
          onClick={() => {
            setEditingReminder(null);
            setShowModal(true);
          }}
          className="btn-primary text-sm py-2.5"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Active',
            value: reminders.filter((r) => r.isActive).length,
            icon: Bell,
            color: 'text-brand-green',
          },
          {
            label: 'Paused',
            value: reminders.filter((r) => !r.isActive).length,
            icon: CalendarClock,
            color: 'text-brand-muted',
          },
          {
            label: 'Overdue',
            value: reminders.filter(
              (r) => isOverdue(r.dueDate) && r.isActive
            ).length,
            icon: CalendarClock,
            color: 'text-brand-error',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-5 text-center"
          >
            <stat.icon
              className={`w-5 h-5 mx-auto mb-2 ${stat.color}`}
            />

            <p className="text-2xl font-display font-semibold text-brand-black">
              {stat.value}
            </p>

            <p className="text-xs text-brand-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-card p-10 text-center">
          <p className="text-sm text-brand-muted">
            Loading reminders...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && reminders.length === 0 && (
        <div className="glass-card p-10 text-center">
          <Bell className="w-12 h-12 mx-auto text-brand-muted mb-4" />

          <h3 className="text-lg font-medium text-brand-black mb-2">
            No reminders yet
          </h3>

          <p className="text-sm text-brand-muted mb-6">
            Create reminders for bills, subscriptions, rent,
            savings, and more.
          </p>

          <button
            onClick={() => {
              setEditingReminder(null);
              setShowModal(true);
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add First Reminder
          </button>
        </div>
      )}

      {/* Reminders List */}
      {!loading && reminders.length > 0 && (
        <div className="space-y-3">
          {reminders.map((reminder, index) => {
            const overdue = isOverdue(reminder.dueDate);

            return (
              <motion.div
                key={reminder._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card p-5 flex items-center gap-4 ${
                  overdue && reminder.isActive
                    ? 'border-brand-error/30 bg-brand-error/5'
                    : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    reminder.isActive
                      ? 'bg-brand-green/10'
                      : 'bg-gray-100'
                  }`}
                >
                  <CalendarClock
                    className={`w-5 h-5 ${
                      reminder.isActive
                        ? 'text-brand-green'
                        : 'text-brand-muted'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-medium ${
                        overdue && reminder.isActive
                          ? 'text-brand-error'
                          : 'text-brand-black'
                      }`}
                    >
                      {reminder.title}
                    </p>

                    {overdue && reminder.isActive && (
                      <span className="px-2 py-0.5 bg-brand-error/10 text-brand-error text-xs rounded-full">
                        Overdue
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-brand-muted">
                    {reminder.description}
                  </p>

                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-brand-muted">
                      {new Date(
                        reminder.dueDate
                      ).toLocaleDateString('en-NG', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>

                    {reminder.amount && (
                      <span className="text-xs font-medium text-brand-black">
                        ₦
                        {Number(
                          reminder.amount
                        ).toLocaleString()}
                      </span>
                    )}

                    <span className="text-xs px-2 py-0.5 rounded-full bg-sage-50 text-brand-muted">
                      {reminder.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      toggleReminder(
                        reminder._id,
                        reminder.isActive
                      )
                    }
                    className="text-brand-muted hover:text-brand-green transition-colors"
                  >
                    {reminder.isActive ? (
                      <ToggleRight className="w-6 h-6 text-brand-green" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setEditingReminder(reminder);
                      setShowModal(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-brand-muted hover:text-brand-black"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(reminder._id)
                    }
                    className="p-2 rounded-lg hover:bg-brand-error/10 text-brand-muted hover:text-brand-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ReminderModal
          reminder={editingReminder}
          onClose={() => {
            setShowModal(false);
            setEditingReminder(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingReminder(null);
            loadReminders();
          }}
        />
      )}
    </div>
  );
}

function ReminderModal({
  reminder,
  onClose,
  onSuccess,
}: {
  reminder: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: reminder?.title || '',
    description: reminder?.description || '',
    dueDate: reminder?.dueDate
      ? new Date(reminder.dueDate)
          .toISOString()
          .split('T')[0]
      : '',
    category:
      reminder?.category || NIGERIAN_CATEGORIES[0],
    amount: reminder?.amount?.toString() || '',
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        amount: formData.amount
          ? parseFloat(formData.amount)
          : 0,
        isActive: reminder?.isActive ?? true,
      };

      if (reminder) {
        await reminderAPI.update(reminder._id, data);
        toast.success('Reminder updated');
      } else {
        await reminderAPI.create(data);
        toast.success('Reminder created');
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(
        reminder
          ? 'Failed to update reminder'
          : 'Failed to create reminder'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-xl font-display font-medium text-brand-black mb-6">
          {reminder ? 'Edit Reminder' : 'Add Reminder'}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Title *
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              placeholder="e.g., Pay NEPA Bill"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Description
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
              placeholder="Optional details"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Due Date *
              </label>

              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Amount (₦)
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
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Category
            </label>

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
            >
              {NIGERIAN_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

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
                : reminder
                ? 'Update'
                : 'Add'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}