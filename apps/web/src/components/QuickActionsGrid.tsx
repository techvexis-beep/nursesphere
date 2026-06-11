'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Bot, Globe, ClipboardList, Calculator, GraduationCap, Briefcase, 
  Brain, Heart, MessageCircle, Building2, Users, Settings, BookOpen,
  Stethoscope, FlaskConical, Award
} from 'lucide-react';

interface QuickAction {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

export default function QuickActionsGrid() {
  const allActions: QuickAction[] = [
    { 
      href: '/study-tutor', 
      label: 'AI Tutor', 
      description: 'Study help', 
      icon: <Bot className="w-5 h-5" />,
      color: '#EC4899',
      gradient: 'from-rose-500 to-pink-500',
    },
    { 
      href: '/migration', 
      label: 'Migration', 
      description: 'Track progress', 
      icon: <Globe className="w-5 h-5" />,
      color: '#6366F1',
      gradient: 'from-indigo-500 to-purple-500',
    },
    { 
      href: '/logbook', 
      label: 'Logbook', 
      description: 'Clinical logs', 
      icon: <ClipboardList className="w-5 h-5" />,
      color: '#EC4899',
      gradient: 'from-rose-500 to-red-500',
    },
    { 
      href: '/dosage', 
      label: 'Calculator', 
      description: 'Dosage tools', 
      icon: <Calculator className="w-5 h-5" />,
      color: '#10B981',
      gradient: 'from-emerald-500 to-teal-500',
    },
    { 
      href: '/exams', 
      label: 'NCLEX Prep', 
      description: 'Practice tests', 
      icon: <GraduationCap className="w-5 h-5" />,
      color: '#F59E0B',
      gradient: 'from-amber-500 to-orange-500',
    },
    { 
      href: '/jobs', 
      label: 'Find Jobs', 
      description: 'Careers', 
      icon: <Briefcase className="w-5 h-5" />,
      color: '#8B5CF6',
      gradient: 'from-violet-500 to-purple-500',
    },
    { 
      href: '/diagnosis', 
      label: 'AI Diagnosis', 
      description: 'Clinical AI', 
      icon: <Brain className="w-5 h-5" />,
      color: '#6366F1',
      gradient: 'from-indigo-500 to-blue-500',
    },
    { 
      href: '/mental-health', 
      label: 'Wellness', 
      description: 'Mental health', 
      icon: <Heart className="w-5 h-5" />,
      color: '#10B981',
      gradient: 'from-emerald-500 to-green-500',
    },
    { 
      href: '/messages', 
      label: 'Messages', 
      description: 'Direct chat', 
      icon: <MessageCircle className="w-5 h-5" />,
      color: '#06B6D4',
      gradient: 'from-cyan-500 to-sky-500',
    },
    { 
      href: '/regulators', 
      label: 'Regulators', 
      description: 'NMC, NCLEX', 
      icon: <Building2 className="w-5 h-5" />,
      color: '#F97316',
      gradient: 'from-orange-500 to-amber-500',
    },
    { 
      href: '/community', 
      label: 'Community', 
      description: 'Network', 
      icon: <Users className="w-5 h-5" />,
      color: '#A855F7',
      gradient: 'from-purple-500 to-fuchsia-500',
    },
    { 
      href: '/research', 
      label: 'Research', 
      description: 'EBP projects', 
      icon: <BookOpen className="w-5 h-5" />,
      color: '#0EA5E9',
      gradient: 'from-sky-500 to-blue-500',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-slate-100 dark:text-slate-100 text-slate-800 mb-4">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {allActions.map((action, index) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/30 dark:bg-slate-800/30 bg-white/50 backdrop-blur-sm border border-slate-700/30 dark:border-slate-700/30 border-slate-200 hover:border-slate-500/50 transition-all duration-300 group"
            >
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                {action.icon}
              </motion.div>
              
              <div className="text-center">
                <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 text-slate-700">
                  {action.label}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 text-slate-500">
                  {action.description}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
