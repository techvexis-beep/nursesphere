'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { ChevronLeft, ChevronRight, Building2, MapPin } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
}

interface FeaturedJobsProps {
  jobs?: Job[];
}

export default function FeaturedJobs({ jobs = [] }: FeaturedJobsProps) {
  const { theme } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const defaultJobs: Job[] = [
    {
      id: '1',
      title: 'Registered Nurse - ICU',
      company: 'Cleveland Clinic',
      location: 'Cleveland, OH',
      salary: '$75,000 - $95,000',
      type: 'Full-time',
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Staff Nurse - Emergency',
      company: 'Mayo Clinic',
      location: 'Rochester, MN',
      salary: '$80,000 - $100,000',
      type: 'Full-time',
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'RN - Medical-Surgical',
      company: 'Johns Hopkins Hospital',
      location: 'Baltimore, MD',
      salary: '$70,000 - $90,000',
      type: 'Full-time',
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      title: 'Critical Care Nurse',
      company: 'UCLA Health',
      location: 'Los Angeles, CA',
      salary: '$85,000 - $110,000',
      type: 'Full-time',
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      title: 'Pediatric Nurse',
      company: 'Boston Children\'s Hospital',
      location: 'Boston, MA',
      salary: '$72,000 - $92,000',
      type: 'Full-time',
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const allJobs = jobs.length > 0 ? jobs : defaultJobs;

  const formatPostedAt = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`mb-8 ${isDark ? '' : 'bg-white rounded-2xl p-6 shadow-sm'}`}>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Featured Nursing Jobs
          </h2>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {allJobs.length} new
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isDark 
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' 
                : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isDark 
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' 
                : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-snap-xMandatory pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {allJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className={`min-w-[300px] scroll-snap-start relative overflow-hidden rounded-2xl p-5 transition-all ${
              isDark 
                ? 'bg-white/5 border border-white/10' 
                : 'bg-gray-50 border border-gray-100 hover:shadow-lg'
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500`} />
            
            <div className="mb-4">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2.5 ${
                isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {job.type}
              </span>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {job.title}
              </h3>
            </div>

            <div className="mb-4">
              <div className={`flex items-center gap-2 text-sm mb-1.5 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                <Building2 className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <div>
                <div className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  Salary Range
                </div>
                <div className="text-sm font-bold text-emerald-500">
                  {job.salary}
                </div>
              </div>
              <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {formatPostedAt(job.postedAt)}
              </span>
            </div>

            <Link
              href={`/jobs?job=${job.id}`}
              className={`block text-center mt-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:opacity-90'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              View Details
            </Link>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
