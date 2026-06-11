'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { FileText, ClipboardList, Plane, Briefcase, Award } from 'lucide-react';

interface Activity {
  id: string;
  type: 'exam' | 'clinical' | 'migration' | 'job' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
}

export default function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  const { theme } = useUser();
  const [filter, setFilter] = useState<string>('all');
  const isDark = theme === 'dark';

  const defaultActivities: Activity[] = [
    {
      id: '1',
      type: 'exam',
      title: 'NCLEX Practice Completed',
      description: 'Cardiovascular System - Score: 85%',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: 'fileText',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
    },
    {
      id: '2',
      type: 'clinical',
      title: 'Clinical Log Submitted',
      description: 'ICU Rotation - 8 hours',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      icon: 'clipboard',
      iconBg: '#D1FAE5',
      iconColor: '#059669',
    },
    {
      id: '3',
      type: 'migration',
      title: 'IELTS Score Updated',
      description: 'Band 7.5 achieved',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      icon: 'plane',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
    },
    {
      id: '4',
      type: 'job',
      title: 'Job Application Sent',
      description: 'RN Position - Cleveland Clinic',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      icon: 'briefcase',
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED',
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Milestone Unlocked!',
      description: 'Completed 100 clinical hours',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      icon: 'award',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
    },
  ];

  const allActivities = activities.length > 0 ? activities : defaultActivities;

  const filteredActivities = filter === 'all' 
    ? allActivities 
    : allActivities.filter(a => a.type === filter);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'fileText': return <FileText className="w-5 h-5" />;
      case 'clipboard': return <ClipboardList className="w-5 h-5" />;
      case 'plane': return <Plane className="w-5 h-5" />;
      case 'briefcase': return <Briefcase className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const filters = [
    { value: 'all', label: 'All', count: allActivities.length },
    { value: 'exam', label: 'Exams', count: allActivities.filter(a => a.type === 'exam').length },
    { value: 'clinical', label: 'Clinical', count: allActivities.filter(a => a.type === 'clinical').length },
    { value: 'migration', label: 'Migration', count: allActivities.filter(a => a.type === 'migration').length },
    { value: 'job', label: 'Jobs', count: allActivities.filter(a => a.type === 'job').length },
  ];

  return (
    <div className={`h-full ${isDark ? '' : 'bg-white rounded-2xl p-6 shadow-sm'}`}>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Activity
        </h3>
        
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer transition-all ${
                filter === f.value 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                  : isDark 
                    ? 'bg-white/10 text-white/60' 
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all ${
                isDark 
                  ? 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10' 
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: activity.iconBg, color: activity.iconColor }}
              >
                {getIconComponent(activity.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {activity.title}
                </div>
                <div className={`text-xs truncate ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  {activity.description}
                </div>
              </div>
              <div className={`text-xs flex-shrink-0 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {formatTime(activity.timestamp)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredActivities.length === 0 && (
        <div className={`py-10 text-center ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>No activities found</p>
        </div>
      )}
    </div>
  );
}
