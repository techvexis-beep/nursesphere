'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
}

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

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
}

interface OverallProgress {
  migrationScore: number;
  examScore: number;
  clinicalHours: number;
  jobReadiness: number;
  overallScore: number;
}

interface UseProgressReturn {
  overallProgress: OverallProgress;
  recentActivity: Activity[];
  upcomingMilestones: Milestone[];
  featuredJobs: JobData[];
  aiInsights: string[];
  isLoading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'exam',
    title: 'NCLEX Practice Completed',
    description: 'Cardiovascular System - Score: 85%',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: '📝',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
  },
  {
    id: '2',
    type: 'clinical',
    title: 'Clinical Log Submitted',
    description: 'ICU Rotation - 8 hours',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: '📋',
    iconBg: '#D1FAE5',
    iconColor: '#059669',
  },
  {
    id: '3',
    type: 'migration',
    title: 'IELTS Score Updated',
    description: 'Band 7.5 achieved',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    icon: '🌍',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: '4',
    type: 'job',
    title: 'Job Application Sent',
    description: 'RN Position - Cleveland Clinic',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    icon: '💼',
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Milestone Unlocked!',
    description: 'Completed 100 clinical hours',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    icon: '🏆',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
  },
];

const mockMilestones: Milestone[] = [
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

const mockInsights = [
  'Based on your recent exam performance, focus on Cardiovascular and Pharmacology topics.',
  'You\'re 2 weeks away from your target IELTS date. Consider taking a mock test this week.',
  'Complete 15 more clinical hours to reach your monthly goal.',
  'New RN positions matching your profile were posted in the last 24 hours.',
  'Your migration readiness score improved by 5% this week. Keep it up!',
];

export function useProgress(): UseProgressReturn {
  const { token, migrationProgress, examStats, clinicalStats } = useUser();
  
  const [overallProgress, setOverallProgress] = useState<OverallProgress>({
    migrationScore: migrationProgress?.readinessScore || 45,
    examScore: examStats?.averageScore || 78,
    clinicalHours: clinicalStats?.totalHours || 320,
    jobReadiness: 65,
    overallScore: 60,
  });
  
  const [recentActivity, setRecentActivity] = useState<Activity[]>(mockActivities);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>(mockMilestones);
  const [featuredJobs, setFeaturedJobs] = useState<JobData[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>(mockInsights);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!token) {
      setFeaturedJobs([
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
      ]);
      return;
    }

    try {
      const response = await fetch(API_BASE_URL + '/api/jobs/external?limit=4', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.jobs && data.jobs.length > 0) {
          setFeaturedJobs(data.jobs.slice(0, 4));
        }
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  }, [token]);

  const refreshProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchJobs(),
      ]);

      setOverallProgress({
        migrationScore: migrationProgress?.readinessScore || 45,
        examScore: examStats?.averageScore || 78,
        clinicalHours: clinicalStats?.totalHours || 320,
        jobReadiness: Math.round((Number(migrationProgress?.readinessScore || 45) + Number(examStats?.averageScore || 78)) / 2),
        overallScore: Math.round(
          ((migrationProgress?.readinessScore || 45) + 
           (examStats?.averageScore || 78) + 
           (clinicalStats?.totalHours ? Math.min(clinicalStats.totalHours / 5, 100) : 64)) / 3
        ),
      });

      const randomInsights = [...mockInsights].sort(() => Math.random() - 0.5).slice(0, 3);
      setAiInsights(randomInsights);
    } catch (err) {
      setError('Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  }, [migrationProgress, examStats, clinicalStats, fetchJobs]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  useEffect(() => {
    setOverallProgress(prev => ({
      ...prev,
      migrationScore: migrationProgress?.readinessScore || prev.migrationScore,
      examScore: examStats?.averageScore || prev.examScore,
      clinicalHours: clinicalStats?.totalHours || prev.clinicalHours,
    }));
  }, [migrationProgress, examStats, clinicalStats]);

  return {
    overallProgress,
    recentActivity,
    upcomingMilestones,
    featuredJobs,
    aiInsights,
    isLoading,
    error,
    refreshProgress,
  };
}

export default useProgress;
