import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  Bell,
  // Settings,
  User,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Search,
  CalendarClock,
  // Sparkles,
  // MessageSquare,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { notificationAPI } from '@/services/api';

const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: Receipt,
    label: 'Expenses',
    path: '/dashboard/expenses',
  },
  {
    icon: Target,
    label: 'Budgets',
    path: '/dashboard/budgets',
  },
  {
    icon: PiggyBank,
    label: 'Savings',
    path: '/dashboard/savings',
  },
  {
    icon: CalendarClock,
    label: 'Reminders',
    path: '/dashboard/reminders',
  },
  {
    icon: Bell,
    label: 'Notifications',
    path: '/dashboard/notifications',
  },
];

const bottomItems = [
  // {
  //   icon: Sparkles,
  //   label: 'AI Insights',
  //   path: '/dashboard/insights',
  // },
  // {
  //   icon: MessageSquare,
  //   label: 'Challenges',
  //   path: '/dashboard/challenges',
  // },
  {
    icon: User,
    label: 'Profile',
    path: '/dashboard/profile',
  },
  // {
  //   icon: Settings,
  //   label: 'Settings',
  //   path: '/dashboard/settings',
  // },
];

export default function DashboardLayout() {
  const location = useLocation();

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [unreadCount, setUnreadCount] =
    useState(0);

    useEffect(() => {
      loadUnreadCount();
    
      const interval = setInterval(() => {
        loadUnreadCount();
      }, 3000);
    
      return () => clearInterval(interval);
    }, [location.pathname]);

  const loadUnreadCount = async () => {
    try {
      const data =
        await notificationAPI.getAll();

      const unread = Array.isArray(data)
        ? data.filter(
            (notification: any) =>
              !notification.isRead
          ).length
        : 0;

      setUnreadCount(unread);
    } catch (error) {
      console.error(
        'Notification count error:',
        error
      );
    }
  };

  const isActive = (path: string) =>
    location.pathname === path;

  const handleNavigation = (
    path: string
  ) => {
    navigate(path);

    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-sage-50/50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full z-30">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <button
            onClick={() =>
              navigate('/dashboard')
            }
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">
                B
              </span>
            </div>

            <span className="font-display font-medium text-xl text-brand-black">
              BudgetWise
            </span>
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() =>
                handleNavigation(item.path)
              }
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'text-brand-muted hover:bg-sage-50 hover:text-brand-black'
              }`}
            >
              <item.icon className="w-5 h-5" />

              {item.label}

              {isActive(item.path) && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="px-4 text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">
              More
            </p>

            {bottomItems.map((item) => (
              <button
                key={item.path}
                onClick={() =>
                  handleNavigation(item.path)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'text-brand-muted hover:bg-sage-50 hover:text-brand-black'
                }`}
              >
                <item.icon className="w-5 h-5" />

                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-gray-100">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sage-50 transition-colors cursor-pointer"
            onClick={() =>
              navigate('/dashboard/profile')
            }
          >
            <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-green" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-black truncate">
                {user?.fullName || 'User'}
              </p>

              <p className="text-xs text-brand-muted truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();

                logout();
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-brand-muted hover:text-brand-error transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setIsSidebarOpen(
                  !isSidebarOpen
                )
              }
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Page Title */}
            <div className="hidden lg:block">
              <h2 className="text-lg font-display font-medium text-brand-black">
                {sidebarItems.find((i) =>
                  isActive(i.path)
                )?.label ||
                  bottomItems.find((i) =>
                    isActive(i.path)
                  )?.label ||
                  'Dashboard'}
              </h2>

              <p className="text-xs text-brand-muted">
                {new Date().toLocaleDateString(
                  'en-NG',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </p>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder="Search expenses, budgets..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-sage-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  navigate(
                    '/dashboard/notifications'
                  )
                }
                className="relative p-2.5 rounded-xl hover:bg-sage-50 transition-colors"
              >
                <Bell className="w-5 h-5 text-brand-muted" />

                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-error rounded-full" />
                )}
              </button>

              <button
                onClick={() =>
                  navigate('/dashboard/profile')
                }
                className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center hover:bg-brand-green/20 transition-colors"
              >
                <User className="w-4 h-4 text-brand-green" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}