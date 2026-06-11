'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import {
  Brain, Sparkles, Zap, TrendingUp, Calendar, Bell, Star, Award,
  Plane, GraduationCap, Briefcase, Users, MessageCircle, Shield,
  Heart, BookOpen, Calculator, Globe, ArrowRight, Play, ChevronRight,
  Clock, MapPin, ExternalLink, Gift, Crown, Rocket, Target,
  Activity, CheckCircle, AlertCircle, Loader2, Flame
} from 'lucide-react';
import NurseSphereLogo from './NurseSphereLogo';

interface NewsEvent {
  id: string;
  type: 'webinar' | 'exam' | 'news' | 'promotion' | 'community';
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  badge: string;
  badgeColor: string;
  link: string;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  stats: string;
  link: string;
  trending?: boolean;
}

interface AdBanner {
  id: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  gradient: string;
  badge: string;
}

export default function DashboardCarousel() {
  const { theme } = useUser();
  const isDark = theme === 'dark';
  const [loadingFeature, setLoadingFeature] = useState<string | null>(null);
  const [aiTyping, setAiTyping] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const features: FeatureCard[] = [
    { id: 'ai-tutor', title: 'AI Study Tutor', description: 'Personalized learning with advanced AI', icon: <Brain className="w-6 h-6" />, gradient: 'from-violet-500 to-purple-600', stats: '24/7 Available', link: '/study-tutor', trending: true },
    { id: 'exams', title: 'NCLEX Prep', description: 'Adaptive CBT exam platform', icon: <GraduationCap className="w-6 h-6" />, gradient: 'from-emerald-500 to-teal-600', stats: '95% Pass Rate', link: '/exams' },
    { id: 'migration', title: 'Migration Tracker', description: 'Track your journey abroad', icon: <Plane className="w-6 h-6" />, gradient: 'from-blue-500 to-cyan-600', stats: '15K+ Migrated', link: '/migration' },
    { id: 'jobs', title: 'Global Jobs', description: 'Find opportunities worldwide', icon: <Briefcase className="w-6 h-6" />, gradient: 'from-orange-500 to-red-600', stats: '20K+ Jobs', link: '/jobs' },
    { id: 'community', title: 'Community', description: 'Connect with nurses globally', icon: <Users className="w-6 h-6" />, gradient: 'from-pink-500 to-rose-600', stats: '50K+ Members', link: '/community' },
    { id: 'dosage', title: 'Dosage Calculator', description: 'Safe medication dosing tools', icon: <Calculator className="w-6 h-6" />, gradient: 'from-amber-500 to-yellow-600', stats: '50+ Formulas', link: '/dosage' },
    { id: 'advocacy', title: 'Nurse Advocacy', description: 'Voice workplace concerns safely', icon: <Shield className="w-6 h-6" />, gradient: 'from-indigo-500 to-blue-600', stats: '5K+ Reports', link: '/advocacy' },
    { id: 'wellness', title: 'Mental Health', description: 'Wellness & burnout support', icon: <Heart className="w-6 h-6" />, gradient: 'from-red-500 to-pink-600', stats: '24/7 Support', link: '/mental-health' },
  ];

  const newsEvents: NewsEvent[] = [
    { id: '1', type: 'webinar', title: 'Live Q&A with NCSBN', description: 'Get your NCLEX questions answered by official board members', date: 'Mar 25', time: '2:00 PM EST', badge: 'LIVE', badgeColor: '#EF4444', link: '/live' },
    { id: '2', type: 'exam', title: 'NCLEX Passing Standard Update', description: 'Important changes to passing standards effective April 2026', date: 'Apr 1', badge: 'UPDATED', badgeColor: '#6366F1', link: '/news' },
    { id: '3', type: 'promotion', title: 'Premium Access - 50% OFF', description: 'Limited time offer for annual premium subscription', date: 'Mar 31', badge: 'LIMITED', badgeColor: '#F59E0B', link: '/pricing' },
    { id: '4', type: 'community', title: 'Global Nurse Marathon', description: 'Join 10,000 nurses in our virtual wellness event', date: 'Apr 5', badge: 'EVENT', badgeColor: '#10B981', link: '/community' },
  ];

  const adBanners: AdBanner[] = [
    { id: '1', title: 'Pro Membership', description: 'Unlock all features. 50% off - Limited time!', cta: 'Upgrade Now', link: '/pricing', gradient: 'from-violet-600 via-purple-600 to-fuchsia-600', badge: 'BEST VALUE' },
    { id: '2', title: 'NCLEX Masterclass', description: 'Live intensive prep course. Seats filling fast!', cta: 'Reserve Seat', link: '/exams', gradient: 'from-emerald-600 via-teal-600 to-cyan-600', badge: 'NEW' },
  ];

  const handleFeatureClick = async (featureId: string) => {
    setLoadingFeature(featureId);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoadingFeature(null);
  };

  const aiQuickActions = [
    'What are the NCLEX passing requirements?',
    'Help me plan my migration to Canada',
    'Explain drug interactions for my patient',
    'Create a study schedule for me',
  ];

  const handleAiAction = (action: string) => {
    setAiTyping(true);
    setAiResponse('');
    const responses = [
      'Based on your profile, I recommend starting with our NCLEX fundamentals course. Your progress shows strong clinical knowledge!',
      'For Canada migration, you need: NCLEX-RN, IELTS 7.0, and CGFNS certification. I can create a personalized timeline for you.',
      'For your patient on Warfarin: Avoid aspirin, monitor INR weekly, watch for bleeding signs. Shall I create a detailed care plan?',
      'I\'ve created a 4-week study plan based on your learning pace. It includes 30 minutes daily practice with adaptive rest days.',
    ];
    const response = responses[aiQuickActions.indexOf(action)] || responses[0];
    
    let index = 0;
    const interval = setInterval(() => {
      setAiResponse(response.slice(0, index));
      index++;
      if (index > response.length) {
        clearInterval(interval);
        setAiTyping(false);
      }
    }, 30);
  };

  return (
    <div className="space-y-6">
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .shimmer-effect {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Hero AI Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl ${isDark ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900' : 'bg-white'} border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} p-6 md:p-8`}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - AI Chat */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center animate-pulse-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Study Assistant</h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Powered by advanced clinical intelligence</p>
              </div>
            </div>

            {/* AI Quick Actions */}
            <div className="space-y-3">
              {aiQuickActions.slice(0, 3).map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleAiAction(action)}
                  disabled={aiTyping}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50 hover:bg-slate-800' 
                      : 'bg-slate-50 border-slate-200 hover:border-violet-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 ${aiTyping ? 'text-violet-500 animate-pulse' : 'text-violet-400'}`} />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{action}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* AI Response */}
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-violet-500/10 border border-violet-500/30' : 'bg-violet-50 border border-violet-200'}`}
              >
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-violet-500 mt-0.5" />
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {aiResponse}
                    {aiTyping && <span className="inline-block w-2 h-4 bg-violet-500 ml-1 animate-pulse" />}
                  </p>
                </div>
              </motion.div>
            )}

            <Link
              href="/study-tutor"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/30 transition-all"
            >
              <Zap className="w-4 h-4" />
              Start AI Chat
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right - Live Stats */}
          <div className="relative">
            {/* Live Clock */}
            <div className={`text-center p-4 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} mb-4`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Platform Live</span>
              </div>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Active Users', value: '12,543', icon: Users, color: '#6366F1' },
                { label: 'Exams Today', value: '2,847', icon: GraduationCap, color: '#10B981' },
                { label: 'Migrations', value: '147', icon: Plane, color: '#F59E0B' },
                { label: 'Success Rate', value: '94.5%', icon: TrendingUp, color: '#EC4899' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-white'} border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} hover:border-violet-500/30 transition-all`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon size={16} style={{ color: stat.color }} />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</span>
                  </div>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ad Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adBanners.map((ad, i) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="relative overflow-hidden rounded-2xl p-5"
            style={{ background: `linear-gradient(135deg, ${ad.gradient})` }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-3">
              {ad.badge}
            </span>
            <h3 className="text-lg font-bold text-white mb-1">{ad.title}</h3>
            <p className="text-white/80 text-sm mb-4">{ad.description}</p>
            <Link
              href={ad.link}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all"
            >
              {ad.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* News & Events Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'} border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} p-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Upcoming Events</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stay ahead with these opportunities</p>
            </div>
          </div>
          <Link href="/news" className={`text-sm font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'} hover:underline`}>
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {newsEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-xl ${isDark ? 'bg-slate-900/50 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100'} transition-all group cursor-pointer`}
            >
              {/* Date Badge */}
              <div className="flex-shrink-0 w-16 text-center">
                <div className={`px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.date.split(' ')[1]}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{event.date.split(' ')[0]}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: event.badgeColor }}
                  >
                    {event.badge}
                  </span>
                  {event.time && (
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Clock size={12} className="inline mr-1" />
                      {event.time}
                    </span>
                  )}
                </div>
                <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.title}</h4>
                <p className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{event.description}</p>
              </div>

              {/* Action */}
              <Link
                href={event.link}
                className={`flex-shrink-0 p-2 rounded-lg ${isDark ? 'bg-slate-800 hover:bg-violet-500/20' : 'bg-white hover:bg-violet-50'} border ${isDark ? 'border-slate-700' : 'border-slate-200'} transition-all group-hover:border-violet-500/50`}
              >
                <ChevronRight size={18} className={`${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-violet-500`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'} border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} p-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Explore Features</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Everything NurseSphere has to offer</p>
            </div>
          </div>
          <Link href="/dashboard" className={`text-sm font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'} hover:underline`}>
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="relative group"
            >
              <Link href={feature.link} onClick={() => handleFeatureClick(feature.id)}>
                <div className={`relative overflow-hidden rounded-xl p-4 ${isDark ? 'bg-slate-900/50 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100'} border ${isDark ? 'border-slate-700/50 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'} transition-all duration-300 h-full`}>
                  {/* Trending Badge */}
                  {feature.trending && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full text-white text-[10px] font-bold flex items-center gap-1">
                      <Zap size={10} />
                      TRENDING
                    </span>
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                    {loadingFeature === feature.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      feature.icon
                    )}
                  </div>

                  {/* Content */}
                  <h4 className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h4>
                  <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{feature.description}</p>
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{feature.stats}</span>

                  {/* Hover Glow */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Access Bar */}
        <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <p className={`text-xs font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>QUICK ACCESS</p>
          <div className="flex flex-wrap gap-2">
            {['NCLEX Prep', 'Migration Guide', 'Salary Calculator', 'AI Diagnosis', 'Live Q&A', 'Marketplace'].map((item, i) => (
              <Link
                key={i}
                href={`/${item.toLowerCase().replace(/ /g, '-').replace('nclex prep', 'exams').replace('salary calculator', 'careers')}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isDark 
                    ? 'bg-slate-800 text-slate-300 hover:bg-violet-500/20 hover:text-violet-400' 
                    : 'bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                } border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Achievements & Rewards Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-2xl ${isDark ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10' : 'bg-gradient-to-br from-amber-50 to-orange-50'} border ${isDark ? 'border-amber-500/20' : 'border-amber-200'} p-6`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Progress</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Keep earning rewards and badges</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Level', value: '12', icon: Star, color: '#F59E0B' },
            { label: 'XP', value: '4,250', icon: Zap, color: '#6366F1' },
            { label: 'Streak', value: '7 days', icon: Flame, color: '#EF4444' },
          ].map((stat, i) => (
            <div key={i} className={`text-center p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
              <stat.icon size={20} style={{ color: stat.color }} className="mx-auto mb-2" />
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Level 13 Progress</span>
            <span className={`text-sm font-bold text-violet-500`}>85%</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            />
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>750 XP to Level 13</p>
        </div>

        <Link
          href="/settings"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/30 transition-all"
        >
          <Award className="w-4 h-4" />
          View All Achievements
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
