'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, CheckCheck, X, Info, CheckCircle, AlertTriangle, 
  XCircle, Award, Lightbulb, Sparkles, ChevronRight, RefreshCw
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import type { Notification } from '@/context/UserContext';

const NOTIFICATION_ICONS = {
  info: <Info size={16} className="text-indigo-400" />,
  success: <CheckCircle size={16} className="text-emerald-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  error: <XCircle size={16} className="text-red-400" />,
  achievement: <Award size={16} className="text-violet-400" />,
  tip: <Lightbulb size={16} className="text-amber-400" />,
  beta: <Sparkles size={16} className="text-cyan-400" />,
  news: <Sparkles size={16} className="text-emerald-400" />,
};

const NOTIFICATION_COLORS = {
  info: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
  success: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  warning: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  error: 'from-red-500/20 to-red-600/10 border-red-500/30',
  achievement: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
  tip: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  beta: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  news: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const { user, notifications, unreadCount, markAsRead, markAllAsRead, setNotifications } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.05);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const latestNews = getLatestNewsNotification();
        if (latestNews) {
          setNotifications(prev => [latestNews, ...prev].slice(0, 20));
        }
      }
    }, 60000);
    return () => clearInterval(newsInterval);
  }, [setNotifications]);

  const getLatestNewsNotification = (): Notification | null => {
    const newsNotifications = [
      { id: 'news_1', type: 'news' as const, title: 'Breaking: NCLEX Updates', message: 'New NCLEX passing standards announced for 2026. Check the news section for details.', read: false, createdAt: new Date().toISOString() },
      { id: 'news_2', type: 'news' as const, title: 'Health Tip of the Day', message: 'Remember to stay hydrated! Nurses should drink at least 8 glasses of water during shifts.', read: false, createdAt: new Date().toISOString() },
      { id: 'news_3', type: 'news' as const, title: 'Migration Pathway Update', message: 'UK opens new fast-track visa for international nurses. Learn more in News.', read: false, createdAt: new Date().toISOString() },
      { id: 'news_4', type: 'news' as const, title: 'Weekly Health Tip', message: 'Practice mindfulness for 5 minutes daily to reduce burnout and improve patient care.', read: false, createdAt: new Date().toISOString() },
      { id: 'news_5', type: 'news' as const, title: 'New Scholarship Available', message: 'Up to $50,000 in nursing scholarships now open. Apply before the deadline!', read: false, createdAt: new Date().toISOString() },
    ];
    return newsNotifications[Math.floor(Math.random() * newsNotifications.length)];
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const news = getLatestNewsNotification();
    if (news) {
      setNotifications(prev => [news, ...prev].filter((n, i, arr) => 
        arr.findIndex(x => x.id === n.id) === i
      ).slice(0, 20));
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getTips = (): Notification[] => [
    { id: 'tip_1', type: 'tip' as const, title: 'Daily Tip', message: 'Complete your profile to unlock achievements and earn XP!', read: false, createdAt: new Date().toISOString() },
    { id: 'tip_2', type: 'tip' as const, title: 'Study Reminder', message: 'You have an NCLEX prep session scheduled for tomorrow.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'tip_3', type: 'beta' as const, title: 'New Feature', message: 'Try our AI Diagnosis feature - now in beta!', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  ];

  const allNotifications = notifications.length > 0 
    ? [...notifications]
    : getTips();
  
  const displayNotifications = allNotifications.slice(0, 20);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative p-2.5 rounded-xl transition-all ${
          isOpen 
            ? 'bg-indigo-500/20 text-indigo-400' 
            : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-rose-500/50"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
        <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
          isConnected ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {isConnected && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-emerald-500"
            />
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ 
                position: 'fixed',
                right: '16px',
                top: '80px',
                width: '380px',
                maxHeight: 'calc(100vh - 100px)',
                zIndex: 101
              }}
              className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                    title="Refresh notifications"
                  >
                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                  </button>
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                    title="Mark all as read"
                  >
                    <CheckCheck size={16} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto" style={{ maxHeight: '400px' }}>
                {displayNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={40} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">No notifications yet</p>
                    <p className="text-xs text-slate-500 mt-1">We'll notify you when something happens</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/50">
                    {displayNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 cursor-pointer transition-all hover:bg-slate-700/30 ${
                          !notification.read ? 'bg-slate-800/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${NOTIFICATION_COLORS[notification.type]}`}>
                            {NOTIFICATION_ICONS[notification.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className={`font-medium text-sm ${
                                !notification.read ? 'text-white' : 'text-slate-300'
                              }`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-slate-500 flex-shrink-0">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-700/50 flex-shrink-0">
                <button className="w-full py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
                  View all notifications
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
