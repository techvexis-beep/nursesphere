'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, Zap, Shield, Video, MessageCircle, Globe, 
  Trophy, Flame, TrendingUp, ChevronRight, Bell, 
  CheckCircle, Clock, Star, Crown, ArrowUpRight
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import RoleBadge, { UserTitleBadge, VerificationLevelBadge } from './RoleBadge';
import NurseSphereLogo from './NurseSphereLogo';

interface BetaFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isNew?: boolean;
}

const BETA_FEATURES: BetaFeature[] = [
  {
    id: 'ai_diagnosis',
    name: 'AI Diagnosis',
    description: 'Smart clinical decision support',
    icon: <Sparkles size={18} />,
    color: '#6366F1',
    isNew: true,
  },
  {
    id: 'blockchain',
    name: 'Blockchain Credentials',
    description: 'Tamper-proof verification',
    icon: <Shield size={18} />,
    color: '#8B5CF6',
  },
  {
    id: 'live_qa',
    name: 'Live Q&A Sessions',
    description: 'Real-time expert sessions',
    icon: <Video size={18} />,
    color: '#EC4899',
  },
  {
    id: 'ai_tutor',
    name: 'AI Study Tutor',
    description: 'Personalized learning AI',
    icon: <MessageCircle size={18} />,
    color: '#10B981',
  },
  {
    id: 'migration',
    name: 'Smart Migration',
    description: 'AI-powered pathway matching',
    icon: <Globe size={18} />,
    color: '#F59E0B',
    isNew: true,
  },
  {
    id: 'gamification',
    name: 'Achievements & Rewards',
    description: 'Level up your nursing career',
    icon: <Trophy size={18} />,
    color: '#EF4444',
  },
];

interface WelcomeScreenProps {
  className?: string;
  compact?: boolean;
}

export default function WelcomeScreen({ className = '', compact = false }: WelcomeScreenProps) {
  const { user, unreadCount } = useUser();

  if (!user) return null;

  const firstName = user.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const getTimeBasedMessage = () => {
    const messages = [
      { condition: user.streak > 7, text: `${user.streak} day streak! Keep it up!`, icon: <Flame size={16} className="text-amber-400" /> },
      { condition: !user.isEmailVerified, text: 'Verify your email to unlock all features', icon: <Clock size={16} className="text-amber-400" /> },
      { condition: user.verificationStatus !== 'verified', text: 'Complete verification for your badge', icon: <Shield size={16} className="text-emerald-400" /> },
      { condition: user.level < 10, text: 'Complete tasks to level up faster', icon: <TrendingUp size={16} className="text-indigo-400" /> },
    ];
    const active = messages.find(m => m.condition);
    return active || { text: 'Ready to make a difference today?', icon: <Star size={16} className="text-amber-400" /> };
  };

  const message = getTimeBasedMessage();

  if (compact) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <RoleBadge user={user} size="lg" showVerified />
        <div className="flex-1 min-w-0">
          <UserTitleBadge user={user} />
          <h1 className="text-lg font-bold text-white truncate mt-1">
            {user.isCreator ? (
              <span className="inline-flex items-center gap-2">
                <Crown size={16} className="text-amber-400" />
                {user.name}
              </span>
            ) : (
              firstName
            )}
          </h1>
        </div>
        {unreadCount > 0 && (
          <div className="relative">
            <Bell size={22} className="text-slate-400" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-white text-xs font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-violet-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <RoleBadge user={user} size="xl" showVerified animated />
              {user.isCreator && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/50">
                    <Crown size={16} className="text-white" />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-sm mb-1"
              >
                {greeting}
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-white mb-2"
              >
                {user.isCreator ? (
                  <span className="inline-flex items-center gap-2">
                    {user.name}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full text-xs font-bold text-amber-400">
                      <Crown size={12} />
                      FOUNDER
                    </span>
                  </span>
                ) : (
                  <>
                    {firstName}
                    <span className="text-slate-500 font-normal ml-1">👋</span>
                  </>
                )}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-3"
              >
                <UserTitleBadge user={user} />
                <VerificationLevelBadge level={user.securityLevel} />
                {user.isEmailVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <CheckCircle size={12} />
                    Email Verified
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                {message.icon}
              </div>
              <p className="text-sm text-slate-300">{message.text}</p>
            </motion.div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <span className="text-sm font-semibold text-white">Beta Features</span>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-medium">
                {user.betaFeatures?.length || 0} Active
              </span>
            </div>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {BETA_FEATURES.filter(f => user.betaFeatures?.includes(f.id) || Math.random() > 0.5).slice(0, 6).map((feature, index) => {
              const isActive = user.betaFeatures?.includes(feature.id);
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50'
                      : 'bg-slate-800/30 border-slate-700/30 opacity-60 hover:opacity-80'
                  }`}
                >
                  {feature.isNew && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                      NEW
                    </span>
                  )}
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <p className="text-xs font-medium text-white mb-0.5">{feature.name}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{feature.description}</p>
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {user.achievements && user.achievements.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                <span className="text-sm font-semibold text-white">Achievements</span>
              </div>
              <div className="flex -space-x-2">
                {user.achievements.slice(0, 5).map((achievement, i) => (
                  <motion.div
                    key={achievement}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-2 border-slate-800 flex items-center justify-center"
                  >
                    <Trophy size={12} className="text-amber-400" />
                  </motion.div>
                ))}
                {user.achievements.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center">
                    <span className="text-xs text-slate-400">+{user.achievements.length - 5}</span>
                  </div>
                )}
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Level {user.level}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${(user.xp % 1000) / 10}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">{user.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
