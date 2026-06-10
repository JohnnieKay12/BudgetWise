import { useState, useEffect } from 'react';
import { userAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Bell, Globe, Shield, CreditCard, ChevronRight, User } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, setUser, refreshUser } = useAuth();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    savingsReminders: true,
    // darkMode: false,
    currency: 'NGN',
    language: 'en',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await userAPI.getSettings();
  
        setSettings({
          emailNotifications:
            data.settings?.emailNotifications ?? true,
  
          pushNotifications:
            data.settings?.pushNotifications ?? true,
  
          budgetAlerts:
            data.settings?.budgetAlerts ?? true,
  
          savingsReminders:
            data.settings?.savingsReminders ?? true,
  
          // darkMode:
          //   data.settings?.theme === 'dark',
  
          currency:
            data.currency ?? 'NGN',
  
          language:
            data.settings?.language ?? 'en',
        });

        // if (data.settings?.theme === 'dark') {
        //   document.documentElement.classList.add('dark');
        // } else {
        //   document.documentElement.classList.remove('dark');
        // }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load settings');
      }
    };
  
    loadSettings();
  }, []);

  const saveSettings = async (
    updatedSettings: typeof settings
  ) => {
    try {
      await userAPI.updateSettings({
        currency: updatedSettings.currency,
  
        settings: {
          emailNotifications:
            updatedSettings.emailNotifications,
  
          pushNotifications:
            updatedSettings.pushNotifications,
  
          budgetAlerts:
            updatedSettings.budgetAlerts,
  
          savingsReminders:
            updatedSettings.savingsReminders,
  
          // theme: updatedSettings.darkMode
          //   ? 'dark'
          //   : 'light',
  
          language: updatedSettings.language,
        },
      });

      // if (updatedSettings.darkMode) {
      //   document.documentElement.classList.add('dark');
      // } else {
      //   document.documentElement.classList.remove('dark');
      // }
      

      await refreshUser();

      toast.success(
        'Settings updated successfully'
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to save setting');
    }
  };

  const handleToggle = async (
    key: string
  ) => {
    const updatedSettings = {
      ...settings,
      [key]: !(settings as any)[key],
    };
  
    setSettings(updatedSettings);
  
    // if (key === 'darkMode') {
    //   document.documentElement.classList.toggle(
    //     'dark',
    //     updatedSettings.darkMode
    //   );
    // }
  
    await saveSettings(updatedSettings);
  };

  const sections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
        { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Get warned when approaching budget limits' },
        { key: 'savingsReminders', label: 'Savings Reminders', desc: 'Reminders for savings deposits' },
      ],
    },
    // {
    //   title: 'Appearance',
    //   icon: Moon,
    //   items: [
    //     { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme' },
    //   ],
    // },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-brand-black">Settings</h2>
        <p className="text-sm text-brand-muted">Customize your BudgetWise experience</p>
      </div>

      {sections.map((section) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <section.icon className="w-5 h-5 text-brand-green" />
            <h3 className="font-display font-medium text-brand-black">{section.title}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-brand-black">{item.label}</p>
                  <p className="text-xs text-brand-muted">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    (settings as any)[item.key] ? 'bg-brand-green' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${
                    (settings as any)[item.key] ? 'left-6' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <Globe className="w-5 h-5 text-brand-green" />
          <h3 className="font-display font-medium text-brand-black">Preferences</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-brand-black">Currency</p>
              <p className="text-xs text-brand-muted">Display currency for amounts</p>
            </div>
            <div className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50">
              Nigerian Naira (₦)
            </div>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-brand-black">Language</p>
              <p className="text-xs text-brand-muted">App display language</p>
            </div>
            <select
              value={settings.language}
              onChange={async (e) => {
                const updatedSettings = {
                  ...settings,
                  language: e.target.value,
                };
              
                setSettings(updatedSettings);
              
                await saveSettings(updatedSettings);
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            >
              <option value="en">English</option>
              <option value="yo">Yoruba</option>
              <option value="ig">Igbo</option>
              <option value="ha">Hausa</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <Shield className="w-5 h-5 text-brand-green" />
          <h3 className="font-display font-medium text-brand-black">Security</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-sage-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-brand-muted" />
              <div className="text-left">
                <p className="text-sm font-medium text-brand-black">Change Password</p>
                <p className="text-xs text-brand-muted">Update your account password</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-muted" />
          </button>
          <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-sage-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-brand-muted" />
              <div className="text-left">
                <p className="text-sm font-medium text-brand-black">Billing History</p>
                <p className="text-xs text-brand-muted">View your payment history</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-muted" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
