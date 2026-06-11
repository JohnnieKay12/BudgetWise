import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Shield, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/services/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    try {
      await userAPI.updateProfile(formData);
  
      setIsEditing(false);
  
      toast.success(
        'Profile updated successfully'
      );
  
      window.location.reload();
    } catch (error) {
      toast.error(
        'Failed to update profile'
      );
    }
  };

  const subscriptionStatus = user?.subscriptionStatus || 'active';
  const isActive = subscriptionStatus === 'active';
  const endDate = user?.subscriptionEndDate ? new Date(user.subscriptionEndDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-brand-black">Profile</h2>
        <p className="text-sm text-brand-muted">Manage your account and subscription</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-brand-green">
              {user?.fullName
                ?.split(' ')
                .map(name => name[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-xl font-display font-medium text-brand-black">{user?.fullName || 'User'}</h3>
            <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
              <Mail className="w-4 h-4 text-brand-muted" />
              <span className="text-sm text-brand-muted">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                isActive ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-error/10 text-brand-error'
              }`}>
                {isActive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {isActive ? 'Active' : 'Expired'}
              </span>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                Premium Plan
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subscription Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <CreditCard className="w-5 h-5 text-brand-green" />
          <h3 className="font-display font-medium text-brand-black">Subscription</h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-sage-50 rounded-xl">
            <p className="text-xs text-brand-muted mb-1">Plan</p>
            <p className="text-sm font-medium text-brand-black">Premium Monthly</p>
          </div>
          <div className="p-4 bg-sage-50 rounded-xl">
            <p className="text-xs text-brand-muted mb-1">Amount</p>
            <p className="text-sm font-medium text-brand-black">₦2,000/month</p>
          </div>
          <div className="p-4 bg-sage-50 rounded-xl">
            <p className="text-xs text-brand-muted mb-1">Status</p>
            <p className={`text-sm font-medium ${isActive ? 'text-brand-green' : 'text-brand-error'}`}>
              {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
            </p>
          </div>
          <div className="p-4 bg-sage-50 rounded-xl">
            <p className="text-xs text-brand-muted mb-1">Renews In</p>
            <p className={`text-sm font-medium ${daysLeft <= 7 ? 'text-brand-yellow' : 'text-brand-black'}`}>
              {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
            </p>
          </div>
        </div>

        <div className="mt-5 p-4 bg-sage-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-brand-muted">Subscription Period</span>
            <span className="text-sm font-medium text-brand-black">
              {new Date(user?.subscriptionStartDate || Date.now()).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })} - {endDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isActive ? 'bg-brand-green' : 'bg-brand-error'}`}
              style={{ width: `${Math.max(0, Math.min(100, (daysLeft / 30) * 100))}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Edit Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-brand-green" />
            <h3 className="font-display font-medium text-brand-black">Account Details</h3>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-sm text-brand-green font-medium hover:underline"
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-black disabled:bg-gray-50 disabled:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-black disabled:bg-gray-50 disabled:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Member Since</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
              <Calendar className="w-4 h-4 text-brand-muted" />
              <span className="text-sm text-brand-muted">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Last Payment
            </label>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
              <CreditCard className="w-4 h-4 text-brand-muted" />

              <span className="text-sm text-brand-muted">
                {user?.lastPaymentDate
                  ? new Date(
                      user.lastPaymentDate
                    ).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'No payment yet'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Next Renewal
            </label>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
              <Calendar className="w-4 h-4 text-brand-muted" />

              <span className="text-sm text-brand-muted">
                {user?.subscriptionEndDate
                  ? new Date(
                      user.subscriptionEndDate
                    ).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Not available'}
              </span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
