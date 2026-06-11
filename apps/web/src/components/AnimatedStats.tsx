'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, GraduationCap, Clock, Briefcase, TrendingUp, Flame, Award } from 'lucide-react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({ 
  value, 
  size = 80, 
  strokeWidth = 6, 
  color = '#6366F1',
  bgColor = 'rgba(99, 102, 241, 0.2)',
  label,
  sublabel 
}: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: size * 0.22,
            fontWeight: 800,
            color: 'white',
          }}
        >
          {Math.round(animatedValue)}{typeof value === 'number' && value <= 100 ? '%' : ''}
        </motion.div>
        {sublabel && (
          <div style={{ 
            fontSize: size * 0.1, 
            color: 'rgba(255,255,255,0.6)',
            marginTop: 2,
          }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  gradient: string;
  color?: string;
  trend?: {
    value: number;
    label: string;
  };
  progress?: number;
}

export function StatCard({ title, value, suffix, prefix, icon, gradient, color = '#6366F1', trend, progress }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-slate-800/40 dark:bg-slate-800/40 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/40 dark:border-slate-700/40 border-slate-200 hover:border-slate-500/50 transition-all duration-300"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <style jsx>{`
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${gradient};
        }
      `}</style>
      
      <div className="flex justify-between items-start mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: gradient }}>
          {icon}
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
            trend.value >= 0 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="mb-1">
        <span className="text-3xl font-extrabold text-slate-100 dark:text-slate-100 text-slate-800">
          {typeof value === 'number' ? (
            <AnimatedCounter end={value} suffix={suffix} prefix={prefix} />
          ) : (
            <>{prefix}{value}{suffix}</>
          )}
        </span>
      </div>
      
      <div className="text-sm text-slate-400 dark:text-slate-400 text-slate-500 mb-3">
        {title}
      </div>

      {progress !== undefined && (
        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ background: gradient }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
      )}
    </motion.div>
  );
}

interface StatsGridProps {
  migrationScore?: number;
  examScore?: number;
  clinicalHours?: number;
  jobReadiness?: number;
}

export function StatsGrid({ 
  migrationScore = 0, 
  examScore = 0, 
  clinicalHours = 0, 
  jobReadiness = 0 
}: StatsGridProps) {
  const stats = [
    { 
      title: 'Migration Readiness', 
      value: migrationScore, 
      icon: <Target className="w-5 h-5" />,
      gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      color: '#6366F1',
      progress: migrationScore,
    },
    { 
      title: 'Clinical Hours', 
      value: clinicalHours,
      suffix: ' hrs',
      icon: <Clock className="w-5 h-5" />,
      gradient: 'linear-gradient(135deg, #EC4899, #F43F5E)',
      color: '#EC4899',
      progress: Math.min((clinicalHours / 500) * 100, 100),
    },
    { 
      title: 'Exam Score', 
      value: examScore,
      suffix: '%',
      icon: <GraduationCap className="w-5 h-5" />,
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      color: '#10B981',
    },
    { 
      title: 'Job Readiness', 
      value: jobReadiness,
      suffix: '%',
      icon: <Briefcase className="w-5 h-5" />,
      gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
      color: '#F59E0B',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak = 12 }: StreakBadgeProps) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-4 py-2 rounded-full border border-orange-500/30"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Flame className="w-5 h-5 text-orange-500" />
      </motion.div>
      <span className="text-sm font-bold text-orange-400">{streak} day streak</span>
    </motion.div>
  );
}

interface AchievementBadgeProps {
  count: number;
}

export function AchievementBadge({ count = 5 }: AchievementBadgeProps) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-4 py-2 rounded-full border border-yellow-500/30"
    >
      <Award className="w-5 h-5 text-yellow-500" />
      <span className="text-sm font-bold text-yellow-400">{count} achievements</span>
    </motion.div>
  );
}

export default AnimatedCounter;
