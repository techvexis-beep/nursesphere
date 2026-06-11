'use client';

import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

interface TodayFocusProps {
  tasks?: {
    id: string;
    title: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
  }[];
  completedCount?: number;
  totalCount?: number;
}

export default function TodayFocus({ 
  tasks = defaultTasks,
  completedCount,
  totalCount 
}: TodayFocusProps) {
  const completed = completedCount ?? tasks.filter(t => t.completed).length;
  const total = totalCount ?? tasks.length;

  return (
    <div className="bg-slate-800/50 dark:bg-slate-800/50 bg-white/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 dark:border-slate-700/50 border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-100 dark:text-slate-100 text-slate-800">
            Today's Focus
          </h3>
        </div>
        <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
          {completed}/{total} done
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer hover:bg-slate-700/30 ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-green-500 border-green-500' 
                : task.priority === 'high'
                  ? 'border-red-400'
                  : task.priority === 'medium'
                    ? 'border-amber-400'
                    : 'border-slate-500'
            }`}>
              {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <span className={`flex-1 text-sm ${
              task.completed 
                ? 'text-slate-400 line-through' 
                : 'text-slate-200 dark:text-slate-200 text-slate-700'
            }`}>
              {task.title}
            </span>
            {!task.completed && (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(completed / total) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

const defaultTasks = [
  { id: '1', title: 'Complete 20 NCLEX practice questions', completed: false, priority: 'high' as const },
  { id: '2', title: 'Review cardiac medications', completed: false, priority: 'medium' as const },
  { id: '3', title: 'Watch IV therapy video', completed: false, priority: 'low' as const },
  { id: '4', title: 'Log clinical hours', completed: true, priority: 'medium' as const },
];
