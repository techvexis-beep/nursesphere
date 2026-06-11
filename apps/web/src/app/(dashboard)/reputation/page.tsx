'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Award, Crown, Shield, Zap, Flame, Star,
  Target, Brain, Heart, Users, ThumbsUp,
  Clock, TrendingUp, Lock, Check, Sparkles,
  BookOpen, GraduationCap, Globe, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser, CREATOR_USER } from '@/context/UserContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  requirement: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar?: string;
  level: string;
  levelColor: string;
  score: number;
  badge: string;
  isCurrentUser?: boolean;
}

const BADGES: Badge[] = [
  {
    id: 'nclex_champion',
    name: 'NCLEX Champion',
    description: 'Passed NCLEX on first attempt with flying colors',
    icon: <GraduationCap size={32} />,
    color: '#10B981',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    requirement: 'Score 90%+ on NCLEX simulation',
    points: 500,
    rarity: 'epic',
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: <Flame size={32} />,
    color: '#F59E0B',
    gradient: 'from-amber-500/20 to-orange-500/20',
    requirement: '7 consecutive days active',
    points: 200,
    rarity: 'rare',
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    icon: <Trophy size={32} />,
    color: '#8B5CF6',
    gradient: 'from-violet-500/20 to-purple-500/20',
    requirement: '30 consecutive days active',
    points: 1000,
    rarity: 'legendary',
  },
  {
    id: 'question_pro',
    name: 'Question Pro',
    description: 'Answer 100 practice questions correctly',
    icon: <Brain size={32} />,
    color: '#6366F1',
    gradient: 'from-indigo-500/20 to-blue-500/20',
    requirement: '100 correct answers',
    points: 300,
    rarity: 'rare',
  },
  {
    id: 'global_nurse',
    name: 'Global Nurse',
    description: 'Start your international nursing journey',
    icon: <Globe size={32} />,
    color: '#06B6D4',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    requirement: 'Begin migration process',
    points: 400,
    rarity: 'rare',
  },
  {
    id: 'clinical_expert',
    name: 'Clinical Expert',
    description: 'Log 100+ clinical hours',
    icon: <Heart size={32} />,
    color: '#EF4444',
    gradient: 'from-red-500/20 to-rose-500/20',
    requirement: '100 clinical hours logged',
    points: 350,
    rarity: 'rare',
  },
  {
    id: 'mentor',
    name: 'Golden Mentor',
    description: 'Help 10+ fellow nurses with their questions',
    icon: <Users size={32} />,
    color: '#EC4899',
    gradient: 'from-pink-500/20 to-rose-500/20',
    requirement: '10 accepted answers',
    points: 450,
    rarity: 'epic',
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Achieve 100% on any examination',
    icon: <Star size={32} />,
    color: '#F59E0B',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    requirement: '100% on any exam',
    points: 250,
    rarity: 'epic',
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete your morning studies before 7 AM',
    icon: <Sparkles size={32} />,
    color: '#14B8A6',
    gradient: 'from-teal-500/20 to-emerald-500/20',
    requirement: '5 early morning sessions',
    points: 150,
    rarity: 'common',
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Study late night when the world sleeps',
    icon: <Clock size={32} />,
    color: '#6366F1',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    requirement: '10 late night sessions',
    points: 150,
    rarity: 'common',
  },
  {
    id: 'helping_hand',
    name: 'Helping Hand',
    description: 'Provide 50 helpful responses in community',
    icon: <ThumbsUp size={32} />,
    color: '#10B981',
    gradient: 'from-emerald-500/20 to-green-500/20',
    requirement: '50 helpful votes received',
    points: 300,
    rarity: 'rare',
  },
  {
    id: 'researcher',
    name: 'Researcher',
    description: 'Read and engage with nursing research articles',
    icon: <BookOpen size={32} />,
    color: '#8B5CF6',
    gradient: 'from-violet-500/20 to-purple-500/20',
    requirement: '25 articles read',
    points: 200,
    rarity: 'common',
  },
  {
    id: 'founder_badge',
    name: 'Founder\'s Legacy',
    description: 'One of the original NurseSphere pioneers',
    icon: <Crown size={32} />,
    color: '#F59E0B',
    gradient: 'from-amber-500/20 to-orange-500/20',
    requirement: 'Join during beta',
    points: 2000,
    rarity: 'legendary',
    earnedAt: '2024-01-01',
  },
  {
    id: 'regulator_trust',
    name: 'Regulator Verified',
    description: 'Verified by nursing regulatory body',
    icon: <Shield size={32} />,
    color: '#10B981',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    requirement: 'Complete regulator verification',
    points: 500,
    rarity: 'epic',
  },
  {
    id: 'top_contributor',
    name: 'Top Contributor',
    description: 'Rank in the top 10 of monthly leaderboard',
    icon: <TrendingUp size={32} />,
    color: '#EF4444',
    gradient: 'from-red-500/20 to-orange-500/20',
    requirement: 'Top 10 monthly rank',
    points: 800,
    rarity: 'legendary',
  },
  {
    id: 'career_climber',
    name: 'Career Climber',
    description: 'Complete career milestone achievements',
    icon: <Briefcase size={32} />,
    color: '#3B82F6',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    requirement: '3 career milestones',
    points: 400,
    rarity: 'rare',
  },
];

const LEVELS = [
  { name: 'Newcomer', min: 0, color: '#6B7280', icon: <Sparkles size={16} /> },
  { name: 'Learner', min: 100, color: '#3B82F6', icon: <BookOpen size={16} /> },
  { name: 'Contributor', min: 500, color: '#10B981', icon: <ThumbsUp size={16} /> },
  { name: 'Expert', min: 1500, color: '#8B5CF6', icon: <Award size={16} /> },
  { name: 'Master', min: 5000, color: '#F59E0B', icon: <Trophy size={16} /> },
  { name: 'Legend', min: 15000, color: '#EF4444', icon: <Crown size={16} /> },
];

const RARITY_BORDERS = {
  common: 'border-border',
  rare: 'border-blue-500',
  epic: 'border-violet-500',
  legendary: 'border-amber-500',
};

const RARITY_GLOWS = {
  common: 'shadow-slate-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-violet-500/40',
  legendary: 'shadow-amber-500/50',
};

function getLevelInfo(score: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].min) {
      return {
        ...LEVELS[i],
        progress: i < LEVELS.length - 1 
          ? ((score - LEVELS[i].min) / (LEVELS[i + 1].min - LEVELS[i].min)) * 100 
          : 100,
        nextLevel: LEVELS[i + 1],
      };
    }
  }
  return { ...LEVELS[0], progress: (score / LEVELS[0].min) * 100, nextLevel: LEVELS[1] };
}

export default function ReputationPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges'>('badges');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const currentUser = user || CREATOR_USER;
  const userLevel = getLevelInfo(currentUser?.xp || 0);

  useEffect(() => {
    const mockLeaderboard: LeaderboardEntry[] = [
      { rank: 1, name: 'Sarah Mitchell', level: 'Legend', levelColor: '#EF4444', score: 24500, badge: '🏆' },
      { rank: 2, name: 'James Rodriguez', level: 'Master', levelColor: '#F59E0B', score: 18200, badge: '⭐' },
      { rank: 3, name: 'Priya Sharma', level: 'Master', levelColor: '#F59E0B', score: 15600, badge: '⭐' },
      { rank: 4, name: 'Michael Chen', level: 'Expert', levelColor: '#8B5CF6', score: 8900, badge: '🎯' },
      { rank: 5, name: 'Emily Johnson', level: 'Expert', levelColor: '#8B5CF6', score: 7200, badge: '🎯' },
      { rank: 6, name: 'David Kim', level: 'Contributor', levelColor: '#10B981', score: 3400, badge: '🌟' },
      { rank: 7, name: 'Fatima Ahmed', level: 'Contributor', levelColor: '#10B981', score: 2100, badge: '🌟' },
      { rank: 8, name: currentUser?.name || 'You', level: userLevel.name, levelColor: userLevel.color, score: currentUser?.xp || 0, badge: '👤', isCurrentUser: true },
    ];
    setLeaderboard(mockLeaderboard);
  }, [currentUser, userLevel]);

  const earnedBadges = currentUser?.achievements?.map(a => BADGES.find(b => b.id === a)).filter(Boolean) as Badge[] || [];
  const earnedBadgeIds = earnedBadges.map(b => b.id);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{userLevel.name}</p>
                  <p className="text-xs text-white/70">Level</p>
                </div>
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
                style={{ backgroundColor: userLevel.color }}
              >
                {userLevel.icon}
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {currentUser?.name || 'Guest'}
              </h1>
              <div className="flex items-center gap-3 text-white/80">
                <span className="flex items-center gap-1">
                  <Trophy size={16} />
                  {(currentUser?.xp || 0).toLocaleString()} XP
                </span>
                <span className="text-white/50">•</span>
                <span className="flex items-center gap-1">
                  <Award size={16} />
                  {earnedBadges.length} Badges
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="md:w-64">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Progress to {userLevel.nextLevel?.name}</span>
              <span>{Math.round(userLevel.progress)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${userLevel.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-card rounded-xl w-fit">
        {[
          { id: 'badges', label: 'Badges', icon: <Award size={18} /> },
          { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex items-center gap-2 px-4 py-2.5"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'badges' ? (
        <div className="space-y-6">
          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Check size={20} className="text-emerald-400" />
                Earned Badges ({earnedBadges.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedBadge(badge)}
                    className={`relative p-4 rounded-2xl bg-gradient-to-br ${badge.gradient} border-2 ${RARITY_BORDERS[badge.rarity]} cursor-pointer hover:scale-105 transition-transform shadow-lg ${RARITY_GLOWS[badge.rarity]}`}
                  >
                    <div 
                      className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${badge.color}20` }}
                    >
                      <div style={{ color: badge.color }}>{badge.icon}</div>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground text-center mb-1">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground text-center">{badge.points.toLocaleString()} XP</p>
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    </div>
                    <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      badge.rarity === 'legendary' ? 'bg-amber-500/30 text-amber-400' :
                      badge.rarity === 'epic' ? 'bg-violet-500/30 text-violet-400' :
                      badge.rarity === 'rare' ? 'bg-blue-500/30 text-blue-400' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {badge.rarity}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Available Badges */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock size={20} className="text-muted-foreground" />
              Available Badges ({BADGES.length - earnedBadges.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {BADGES.filter(b => !earnedBadgeIds.includes(b.id)).map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedBadge(badge)}
                  className="relative p-4 rounded-2xl bg-card/50 border border-border cursor-pointer hover:border-border hover:bg-card transition-all opacity-60 hover:opacity-100"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center bg-muted">
                    <div className="text-muted-foreground">{badge.icon}</div>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground text-center mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground/70 text-center">{badge.points.toLocaleString()} XP</p>
                  <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    badge.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-500' :
                    badge.rarity === 'epic' ? 'bg-violet-500/20 text-violet-500' :
                    badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {badge.rarity}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How to Earn */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap size={20} className="text-amber-400" />
              How to Earn XP
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { action: 'Daily Login', points: '+10', icon: <Sparkles size={16} />, color: '#6366F1' },
                { action: 'Complete Quiz', points: '+25', icon: <Brain size={16} />, color: '#8B5CF6' },
                { action: 'Help Others', points: '+50', icon: <Heart size={16} />, color: '#EF4444' },
                { action: 'Post Article', points: '+100', icon: <BookOpen size={16} />, color: '#10B981' },
                { action: 'Share Career', points: '+75', icon: <Globe size={16} />, color: '#06B6D4' },
              ].map((item) => (
                <div
                  key={item.action}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <div style={{ color: item.color }}>{item.icon}</div>
                    <span className="text-xs text-muted-foreground">{item.action}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                entry.isCurrentUser
                  ? 'bg-primary/10 border-2 border-primary/50'
                  : index < 3
                    ? `bg-gradient-to-r ${index === 0 ? 'from-amber-500/10 to-yellow-500/10' : index === 1 ? 'from-muted/50 to-muted/30' : 'from-orange-600/10 to-orange-400/10'} border border-border`
                    : 'bg-card border border-border hover:border-border'
              }`}
            >
              {/* Rank */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                entry.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-900' :
                entry.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800' :
                entry.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {entry.rank <= 3 ? <Trophy size={20} /> : entry.rank}
              </div>

              {/* Avatar & Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-foreground font-semibold"
                  style={{ background: `linear-gradient(135deg, ${entry.levelColor}, ${entry.levelColor}80)` }}
                >
                  {entry.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground truncate">{entry.name}</p>
                    {entry.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-primary/30 text-primary/80 text-xs rounded-full">You</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: entry.levelColor }}>
                    {LEVELS.find(l => l.name === entry.level)?.icon}
                    {entry.level}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">{entry.score.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedBadge(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md p-6 rounded-3xl bg-card border-2 ${RARITY_BORDERS[selectedBadge.rarity]} shadow-2xl ${RARITY_GLOWS[selectedBadge.rarity]}`}
          >
            <div className="text-center">
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${selectedBadge.color}30, ${selectedBadge.color}10)` }}
              >
                <div style={{ color: selectedBadge.color }}>{selectedBadge.icon}</div>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${
                selectedBadge.rarity === 'legendary' ? 'bg-amber-500/30 text-amber-400' :
                selectedBadge.rarity === 'epic' ? 'bg-violet-500/30 text-violet-400' :
                selectedBadge.rarity === 'rare' ? 'bg-blue-500/30 text-blue-400' :
                'bg-muted text-muted-foreground'
              }`}>
                {selectedBadge.rarity}
              </span>
              <h2 className="text-2xl font-bold text-foreground mb-2">{selectedBadge.name}</h2>
              <p className="text-muted-foreground mb-4">{selectedBadge.description}</p>
              
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-amber-400">{selectedBadge.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP Value</p>
                </div>
                {selectedBadge.earnedAt && (
                  <div className="text-center">
                    <p className="text-xl font-bold text-emerald-400">Earned</p>
                    <p className="text-xs text-muted-foreground">{new Date(selectedBadge.earnedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-muted mb-6">
                <p className="text-sm text-muted-foreground mb-1">How to earn:</p>
                <p className="text-sm text-foreground">{selectedBadge.requirement}</p>
              </div>

              <Button
                variant="secondary"
                onClick={() => setSelectedBadge(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
