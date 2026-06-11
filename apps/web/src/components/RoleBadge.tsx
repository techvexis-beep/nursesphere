'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Star, Crown, Zap, Sparkles, CheckCircle, Lock } from 'lucide-react';
import { User, ROLE_ABBREVIATIONS, ROLE_TITLES, ROLE_COLORS, VerificationStatus } from '@/context/UserContext';

interface RoleBadgeProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showVerified?: boolean;
  animated?: boolean;
  className?: string;
}

const BADGE_SHAPES = {
  LICENSED_NURSE: {
    icon: Shield,
    pattern: 'shield',
    bgGradient: 'from-emerald-500/20 to-teal-500/20',
    borderGradient: 'from-emerald-500 to-teal-500',
  },
  NURSE_STUDENT: {
    icon: Sparkles,
    pattern: 'hexagon',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
    borderGradient: 'from-indigo-500 to-purple-500',
  },
  MIGRATING_NURSE: {
    icon: Zap,
    pattern: 'diamond',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    borderGradient: 'from-amber-500 to-orange-500',
  },
  REGULATORY_BODY: {
    icon: Award,
    pattern: 'circle',
    bgGradient: 'from-violet-500/20 to-purple-500/20',
    borderGradient: 'from-violet-500 to-purple-500',
  },
  NURSE_ADVOCATE: {
    icon: Star,
    pattern: 'star',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    borderGradient: 'from-pink-500 to-rose-500',
  },
  ADMIN: {
    icon: Crown,
    pattern: 'shield',
    bgGradient: 'from-red-500/20 to-orange-500/20',
    borderGradient: 'from-red-500 to-orange-500',
  },
};

const SIZES = {
  sm: { badge: 'w-8 h-10', text: 'text-[8px]', icon: 12 },
  md: { badge: 'w-12 h-14', text: 'text-[10px]', icon: 14 },
  lg: { badge: 'w-16 h-20', text: 'text-xs', icon: 18 },
  xl: { badge: 'w-20 h-24', text: 'text-sm', icon: 22 },
};

export default function RoleBadge({
  user,
  size = 'md',
  showName = false,
  showVerified = true,
  animated = true,
  className = ''
}: RoleBadgeProps) {
  const badgeConfig = BADGE_SHAPES[user.role] || BADGE_SHAPES.ADMIN;
  const sizeConfig = SIZES[size];
  const Icon = badgeConfig.icon;
  const abbreviation = ROLE_ABBREVIATIONS[user.role];
  const title = ROLE_TITLES[user.role];
  const color = ROLE_COLORS[user.role];

  const badgeContent = (
    <div className={`relative ${className}`}>
      <div className={`relative ${sizeConfig.badge}`}>
        <svg viewBox="0 0 60 70" className="w-full h-full">
          <defs>
            <linearGradient id={`badge-grad-${user.role}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
            <filter id={`glow-${user.role}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <path
            d="M30 2 L55 15 L55 40 L30 68 L5 40 L5 15 Z"
            fill={`url(#badge-grad-${user.role})`}
            stroke={color}
            strokeWidth="2"
            filter={animated ? `url(#glow-${user.role})` : undefined}
            className="transition-all duration-500"
          />
          
          <path
            d="M30 8 L50 18 L50 38 L30 58 L10 38 L10 18 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="mb-0.5"
            style={{ color }}
          >
            <Icon size={sizeConfig.icon} strokeWidth={2.5} />
          </div>
          <span 
            className={`font-bold ${sizeConfig.text} tracking-wider`}
            style={{ color }}
          >
            {abbreviation}
          </span>
        </div>

        {showVerified && user.verificationStatus === 'verified' && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <CheckCircle size={10} className="text-white" />
            </div>
          </div>
        )}

        {user.verificationStatus === 'pending' && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse">
              <Sparkles size={8} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {showName && (
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold text-white">{title}</p>
          {user.isCreator && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium mt-0.5">
              <Crown size={8} />
              FOUNDER
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="cursor-pointer"
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
}

interface UserTitleBadgeProps {
  user: User;
  className?: string;
}

export function UserTitleBadge({ user, className = '' }: UserTitleBadgeProps) {
  const color = ROLE_COLORS[user.role];
  const title = ROLE_TITLES[user.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm ${className}`}
    >
      <div 
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      <span className="text-sm font-medium" style={{ color }}>
        {title}
      </span>
      {user.verificationStatus === 'verified' && (
        <CheckCircle size={14} className="text-emerald-400" />
      )}
    </motion.div>
  );
}

interface VerificationLevelBadgeProps {
  level: number;
  className?: string;
}

export function VerificationLevelBadge({ level, className = '' }: VerificationLevelBadgeProps) {
  const levels = [
    { label: 'Basic', color: '#6B7280', icon: Lock },
    { label: 'Email', color: '#6366F1', icon: Lock },
    { label: 'Verified', color: '#10B981', icon: CheckCircle },
    { label: 'Premium', color: '#F59E0B', icon: Crown },
  ];

  const currentLevel = levels[Math.min(level, levels.length - 1)];
  const Icon = currentLevel.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 ${className}`}
    >
      <Icon size={12} style={{ color: currentLevel.color }} />
      <span className="text-xs font-medium" style={{ color: currentLevel.color }}>
        {currentLevel.label}
      </span>
    </motion.div>
  );
}
