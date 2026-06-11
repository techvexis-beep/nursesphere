'use client';

import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Plane, FileText, HeartPulse } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
}

interface MilestonesPanelProps {
  milestones?: Milestone[];
}

export default function MilestonesPanel({ milestones = [] }: MilestonesPanelProps) {
  const { theme } = useUser();
  const isDark = theme === 'dark';

  const defaultMilestones: Milestone[] = [
    {
      id: '1',
      title: 'IELTS Exam',
      description: 'Achieve minimum band score of 7.0',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 75,
      status: 'in_progress',
      category: 'migration',
    },
    {
      id: '2',
      title: 'NCLEX-RN Certification',
      description: 'Pass the NCLEX-RN examination',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 45,
      status: 'in_progress',
      category: 'exam',
    },
    {
      id: '3',
      title: 'Credential Evaluation',
      description: 'Complete CGFNS credential evaluation',
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 30,
      status: 'in_progress',
      category: 'migration',
    },
    {
      id: '4',
      title: 'Clinical Hours',
      description: 'Complete 500 clinical hours requirement',
      dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 60,
      status: 'in_progress',
      category: 'clinical',
    },
  ];

  const allMilestones = milestones.length > 0 ? milestones : defaultMilestones;

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'migration':
        return { gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)', icon: Plane };
      case 'exam':
        return { gradient: 'linear-gradient(135deg, #10B981, #059669)', icon: FileText };
      case 'clinical':
        return { gradient: 'linear-gradient(135deg, #EC4899, #F43F5E)', icon: HeartPulse };
      default:
        return { gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)', icon: FileText };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', bg: 'rgba(16, 185, 129, 0.2)', color: '#10B981' };
      case 'in_progress':
        return { label: 'In Progress', bg: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' };
      default:
        return { label: 'Pending', bg: 'rgba(107, 114, 128, 0.2)', color: '#6B7280' };
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `${diffDays} days left`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks left`;
    return `${Math.floor(diffDays / 30)} months left`;
  };

  const overallProgress = Math.round(
    allMilestones.reduce((acc, m) => acc + m.progress, 0) / allMilestones.length
  );

  return (
    <div className={`h-full ${isDark ? '' : 'bg-white rounded-2xl p-6 shadow-sm'}`}>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Upcoming Milestones
          </h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            {allMilestones.length} active goals
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 relative">
            <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
                strokeWidth="5"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="url(#milestoneGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 138 }}
                animate={{ strokeDashoffset: 138 - (overallProgress / 100) * 138 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ strokeDasharray: 138 }}
              />
              <defs>
                <linearGradient id="milestoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {overallProgress}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {allMilestones.map((milestone, index) => {
          const categoryStyle = getCategoryColors(milestone.category);
          const statusStyle = getStatusBadge(milestone.status);
          const IconComponent = categoryStyle.icon;
          
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl transition-all ${
                isDark 
                  ? 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10' 
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: categoryStyle.gradient }}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {milestone.title}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                      {formatDueDate(milestone.dueDate)}
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isDark ? '' : ''}`}
                  style={{ background: statusStyle.bg, color: statusStyle.color }}>
                  {statusStyle.label}
                </span>
              </div>
              
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                    Progress
                  </span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {milestone.progress}%
                  </span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${milestone.progress}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: categoryStyle.gradient }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
