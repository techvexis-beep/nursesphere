'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Bell, Shield, Eye, EyeOff, Save, Camera,
  Award, Trophy, Flame, TrendingUp, Star, Crown,
  Check, Lock, Globe, Mail, Phone, Calendar,
  ChevronRight, LogOut, Download,
  CreditCard, Zap, Sparkles, Briefcase,
  CheckCircle2, AlertCircle, ExternalLink, RefreshCw,
  UserCheck, Stethoscope, HeartPulse, GraduationCap,
  Microscope, ShieldCheck, BookOpen, Glasses,
  HeartHandshake, Sun, Compass, Sparkle
} from 'lucide-react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  useUser, CREATOR_USER, SUBSCRIPTION_TIERS, 
  getTierGradient, getTierColor, SubscriptionTier 
} from '@/context/UserContext';
import RoleBadge from '@/components/RoleBadge';

const BADGES = [
  { id: 'nclex_champion', name: 'NCLEX Champion', icon: Award, color: '#10B981', earned: true },
  { id: 'week_warrior', name: 'Week Warrior', icon: Flame, color: '#F59E0B', earned: true },
  { id: 'monthly_master', name: 'Monthly Master', icon: Trophy, color: '#8B5CF6', earned: false },
  { id: 'question_pro', name: 'Question Pro', icon: Star, color: '#6366F1', earned: false },
  { id: 'global_nurse', name: 'Global Nurse', icon: Globe, color: '#06B6D4', earned: false },
  { id: 'clinical_expert', name: 'Clinical Expert', icon: Award, color: '#EF4444', earned: false },
];

const AVATAR_ICONS: Record<string, React.ComponentType<any>> = {
  clinician: UserCheck,
  nurse: User,
  educator: GraduationCap,
  researcher: Microscope,
  specialist: Stethoscope,
  cardiology: HeartPulse,
  mentor: ShieldCheck,
  academic: BookOpen,
  scholar: Glasses,
  wellness: HeartHandshake,
  leader: Crown,
  veteran: Award,
  explorer: Compass,
  elite: Sparkle,
  rising: Star,
  champion: Trophy,
};

const AVATARS = [
  { id: 'clinician', icon: UserCheck, label: 'Clinician' },
  { id: 'nurse', icon: User, label: 'Nurse' },
  { id: 'educator', icon: GraduationCap, label: 'Educator' },
  { id: 'researcher', icon: Microscope, label: 'Researcher' },
  { id: 'specialist', icon: Stethoscope, label: 'Specialist' },
  { id: 'cardiology', icon: HeartPulse, label: 'Cardiology' },
  { id: 'mentor', icon: ShieldCheck, label: 'Mentor' },
  { id: 'academic', icon: BookOpen, label: 'Academic' },
  { id: 'scholar', icon: Glasses, label: 'Scholar' },
  { id: 'wellness', icon: HeartHandshake, label: 'Wellness' },
  { id: 'leader', icon: Crown, label: 'Leader' },
  { id: 'veteran', icon: Award, label: 'Veteran' },
  { id: 'explorer', icon: Compass, label: 'Explorer' },
  { id: 'elite', icon: Sparkle, label: 'Elite' },
  { id: 'rising', icon: Star, label: 'Rising Star' },
  { id: 'champion', icon: Trophy, label: 'Champion' },
];

const LEVELS = [
  { name: 'Newcomer', min: 0, color: '#6B7280' },
  { name: 'Learner', min: 100, color: '#3B82F6' },
  { name: 'Contributor', min: 500, color: '#10B981' },
  { name: 'Expert', min: 1500, color: '#8B5CF6' },
  { name: 'Master', min: 5000, color: '#F59E0B' },
  { name: 'Legend', min: 15000, color: '#EF4444' },
];

export default function SettingsPage() {
  const { user: contextUser, theme, toggleTheme } = useUser();
  const user = contextUser || CREATOR_USER;
  const [activeTab, setActiveTab] = useState('profile');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatar: 'clinician',
  });

  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email,
        phone: user.profile?.phone || '',
        bio: '',
        avatar: user.avatar || 'clinician',
      });
    }
  }, [user]);

  const getLevelInfo = (xp: number) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].min) {
        return {
          ...LEVELS[i],
          progress: i < LEVELS.length - 1 
            ? ((xp - LEVELS[i].min) / (LEVELS[i + 1].min - LEVELS[i].min)) * 100 
            : 100,
        };
      }
    }
    return { ...LEVELS[0], progress: 0 };
  };

  const levelInfo = getLevelInfo(user?.xp || 0);
  const earnedBadges = BADGES.filter(b => b.earned);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
  };

  const selectAvatar = (avatar: string) => {
    setFormData({ ...formData, avatar });
    setShowAvatarPicker(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-card/95 border border-border p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-4xl md:text-5xl shadow-lg shadow-primary/30">
              {(() => {
                const AvatarIcon = AVATAR_ICONS[formData.avatar] || User;
                return <AvatarIcon size={40} className="text-white" />;
              })()}
            </div>
            <Button
              variant="default"
              size="icon"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl shadow-lg"
            >
              <Camera size={18} />
            </Button>
            
            {showAvatarPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-72 max-w-[calc(100vw-2rem)] p-4 bg-card border border-border rounded-2xl shadow-2xl z-50"
              >
                <p className="text-sm font-medium text-foreground mb-3 text-center">Choose Avatar</p>
                <div className="grid grid-cols-4 gap-2">
                  {AVATARS.map((av) => {
                    const Icon = av.icon;
                    return (
                      <Button
                        key={av.id}
                        variant="ghost"
                        size="icon"
                        onClick={() => selectAvatar(av.id)}
                        className={`p-2 h-auto ${
                          formData.avatar === av.id
                            ? 'bg-primary/30 ring-2 ring-primary'
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                        title={av.label}
                      >
                        <Icon size={20} className="text-foreground" />
                      </Button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {formData.firstName || 'User'} {formData.lastName}
              </h1>
              {user && <RoleBadge user={user} size="sm" animated={false} />}
            </div>
            <p className="text-muted-foreground mb-4">{formData.email}</p>
            
            {/* Level Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-card/50 border border-border">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${levelInfo.color}20` }}
              >
                <Trophy size={20} style={{ color: levelInfo.color }} />
              </div>
              <div>
                <p className="font-semibold text-foreground" style={{ color: levelInfo.color }}>
                  {levelInfo.name}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {user?.xp?.toLocaleString() || 0} XP
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
            <div className="text-center min-w-[80px]">
              <div className="flex items-center justify-center gap-1 text-xl font-bold text-amber-400">
                <Flame size={20} />
                {user?.streak || 0}
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center min-w-[80px]">
              <div className="flex items-center justify-center gap-1 text-xl font-bold text-violet-400">
                <Award size={20} />
                {earnedBadges.length}
              </div>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
            <div className="text-center min-w-[80px]">
              <div className="flex items-center justify-center gap-1 text-xl font-bold text-emerald-400">
                <TrendingUp size={20} />
                {user?.level || 1}
              </div>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress to next level</span>
            <span className="text-foreground font-medium">{Math.round(levelInfo.progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}80)` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1 bg-card rounded-xl w-full lg:w-fit overflow-x-auto scrollbar-none [-webkit-overflow-scrolling:touch] snap-x snap-mandatory">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap snap-start flex-shrink-0"
            >
              <Icon size={18} />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">First Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-11 py-3 rounded-xl bg-muted border-border text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Last Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="pl-11 py-3 rounded-xl bg-muted border-border text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled
                  className="pl-11 py-3 rounded-xl bg-muted border-border text-foreground focus:border-primary/50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Phone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="pl-11 py-3 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <Save size={18} />
                </motion.div>
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>
      )}

      {activeTab === 'subscription' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <SubscriptionTab user={user} />
        </motion.div>
      )}

      {activeTab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BADGES.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-2xl border-2 transition-all ${
                    badge.earned
                      ? 'bg-gradient-to-br from-card to-card/95 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                      : 'bg-card/50 border-border opacity-50'
                  }`}
                >
                  <div 
                    className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: badge.earned ? `${badge.color}20` : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <Icon 
                      size={24} 
                      style={{ color: badge.earned ? badge.color : '#6B7280' }} 
                    />
                  </div>
                  <p className={`text-sm font-medium text-center ${
                    badge.earned ? 'text-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {badge.name}
                  </p>
                  {badge.earned && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  {!badge.earned && (
                    <div className="absolute top-2 right-2">
                      <Lock size={12} className="text-muted-foreground/50" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h2>
          
          {[
            { label: 'Email Notifications', desc: 'Receive updates via email', enabled: true },
            { label: 'Push Notifications', desc: 'Browser push notifications', enabled: true },
            { label: 'Daily Reminders', desc: 'Study reminders and tips', enabled: false },
            { label: 'Achievement Alerts', desc: 'Badge and level up notifications', enabled: true },
            { label: 'Community Activity', desc: 'Replies and mentions', enabled: true },
            { label: 'Migration Updates', desc: 'Pathway status changes', enabled: false },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <button
                className={`w-12 h-7 rounded-full transition-all ${
                  item.enabled ? 'bg-emerald-500' : 'bg-muted'
                }`}
              >
                <motion.div
                  animate={{ x: item.enabled ? 20 : 4 }}
                  className="w-5 h-5 rounded-full bg-white shadow"
                />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-6">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Current Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    className="pl-11 pr-12 py-3 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="pl-11 pr-12 py-3 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50"
                  />
                </div>
              </div>

              <Button variant="default" className="w-full">
                Update Password
              </Button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Shield size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="secondary">
                Enable
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">
              <LogOut size={16} className="inline mr-2" />
              Sign out of all devices - This will log you out everywhere except this device.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface SubscriptionTabProps {
  user: ReturnType<typeof useUser>['user'];
}

function SubscriptionTab({ user }: SubscriptionTabProps) {
  const currentTier: SubscriptionTier = user?.subscription?.tier || 'free';
  const subscriptionStatus = user?.subscription?.status;
  const subscriptionEndsAt = user?.subscription?.endsAt;
  
  const currentPlan = SUBSCRIPTION_TIERS[currentTier];
  const tierColor = getTierColor(currentTier);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const daysRemaining = subscriptionEndsAt
    ? Math.max(0, Math.ceil((new Date(subscriptionEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 border border-border"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
            style={{ background: `radial-gradient(circle, ${tierColor}40, transparent)` }}
          />
        </div>

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${tierColor}30, ${tierColor}10)`,
                  border: `1px solid ${tierColor}30`,
                }}
              >
                {currentTier === 'free' ? (
                  <CreditCard size={28} className="text-muted-foreground" />
                ) : (
                  <Crown size={28} style={{ color: tierColor }} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-foreground">{currentPlan.name} Plan</h3>
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ 
                      background: `linear-gradient(135deg, ${tierColor}20, ${tierColor}10)`,
                      color: tierColor,
                    }}
                  >
                    {subscriptionStatus || 'active'}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  ${currentPlan.price}
                  <span className="text-muted-foreground/70">/month</span>
                </p>
              </div>
            </div>

            {currentTier !== 'enterprise' && (
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'flex items-center gap-2'
                )}
                style={{ 
                  background: `linear-gradient(135deg, ${tierColor}, ${currentTier === 'pro' ? '#7C3AED' : '#F59E0B'})`,
                  boxShadow: `0 4px 20px ${tierColor}40`,
                }}
              >
                <Zap size={16} />
                Upgrade
              </Link>
            )}
          </div>

          {subscriptionEndsAt && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border/50 mb-4">
              <AlertCircle size={18} className="text-amber-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {subscriptionStatus === 'cancelled' ? 'Subscription Cancelled' : 'Subscription Active'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {subscriptionStatus === 'cancelled' 
                    ? `Access until ${formatDate(subscriptionEndsAt)}`
                    : `${daysRemaining} days remaining in billing period`
                  }
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Started</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(user?.subscription?.startedAt)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Next Billing</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {subscriptionStatus === 'cancelled' ? 'Cancelled' : formatDate(subscriptionEndsAt)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Payment</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {user?.subscription?.stripeCustomerId ? 'Visa ***4242' : 'Demo Mode'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Your {currentPlan.name} Features</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {currentPlan.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${tierColor}20` }}
              >
                <CheckCircle2 size={16} style={{ color: tierColor }} />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {currentTier === 'free' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-violet-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Unlock Premium Features</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to Pro for unlimited exams, AI tutoring, and priority support.
                </p>
                <Link
                  href="/pricing"
                  className={buttonVariants({ variant: 'default', className: 'gap-2' })}
                >
                  View Pro Plan <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {currentTier === 'pro' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Briefcase size={20} className="text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Need Hospital Recruitment Tools?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to Enterprise for recruitment features, API access, and custom branding.
                </p>
                <Link
                  href="/pricing"
                  className={buttonVariants({ variant: 'default', className: 'gap-2' })}
                >
                  View Enterprise Plan <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {user?.subscription?.stripeSubscriptionId && (
            <Button variant="secondary" className="flex-1 gap-2">
              <ExternalLink size={16} />
              Manage Billing
            </Button>
          )}
          <Button variant="secondary" className="flex-1 gap-2">
            <Download size={16} />
            Download Invoices
          </Button>
        </div>
      </motion.div>

      {['pro', 'enterprise'].includes(currentTier) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <p className="text-sm text-destructive">
            <AlertCircle size={16} className="inline mr-2" />
            {subscriptionStatus === 'cancelled' 
              ? 'Your subscription will not renew. You will be downgraded to Free when it expires.'
              : 'Want to cancel? Your subscription will remain active until the end of the billing period.'
            }
          </p>
          <Button variant="outline" size="sm" className="mt-3">
            Cancel Subscription
          </Button>
        </motion.div>
      )}
    </>
  );
}
