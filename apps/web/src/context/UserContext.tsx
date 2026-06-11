'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { secureStorage, generateUserId, generateVerificationCode } from '@/lib/crypto';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

export type UserRole = 'LICENSED_NURSE' | 'NURSE_STUDENT' | 'MIGRATING_NURSE' | 'REGULATORY_BODY' | 'NURSE_ADVOCATE' | 'ADMIN';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';
export type HospitalLicenseTier = 'basic' | 'professional' | 'enterprise';

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startedAt: string;
  endsAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface HospitalClient {
  id: string;
  name: string;
  email: string;
  hospitalName: string;
  licenseTier: HospitalLicenseTier;
  jobPostingsUsed: number;
  jobPostingsLimit: number;
  nurseAccessUsed: number;
  nurseAccessLimit: number;
  analyticsAccess: boolean;
  apiAccess: boolean;
  status: 'active' | 'suspended';
  subscribedAt: string;
  expiresAt: string;
  stripeCustomerId?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  regulatorBody: string;
  licenseNumber: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  feeStatus: 'pending' | 'paid' | 'refunded';
  feeAmount: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  activeSubscribers: number;
  freeUsers: number;
  proUsers: number;
  enterpriseUsers: number;
  churnRate: number;
  ltv: number;
  arpu: number;
  verificationRevenue: number;
  hospitalRevenue: number;
  totalRevenue: number;
}

export interface NurseProfile {
  dateOfBirth: string;
  country: string;
  gender: Gender;
  phone?: string;
  specialization?: string;
  yearsOfExperience?: number;
  institution?: string;
  targetCountry?: string;
  languages?: string[];
  licenseNumber?: string;
  regulatorId?: string;
  regulatorBody?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  isCreator?: boolean;
  creatorTitle?: string;
  creatorBadge?: string;
  profile?: NurseProfile;
  verificationStatus: VerificationStatus;
  isEmailVerified: boolean;
  verificationCode?: string;
  codeExpiry?: string;
  hasCompletedOnboarding: boolean;
  lastLogin?: string;
  loginAttempts?: number;
  lockedUntil?: string;
  securityLevel: number;
  betaFeatures: string[];
  unreadNotifications: number;
  achievements: string[];
  level: number;
  xp: number;
  streak: number;
  subscription?: Subscription;
  hospitalClient?: HospitalClient;
  referralCode?: string;
  referredBy?: string;
}

export interface OnboardingData {
  dateOfBirth: string;
  country: string;
  gender: Gender;
  specialization?: string;
  yearsOfExperience?: number;
  institution?: string;
  targetCountry?: string;
  languages?: string[];
  regulatorId?: string;
  regulatorBody?: string;
  licenseNumber?: string;
}

export const ROLE_ABBREVIATIONS: Record<UserRole, string> = {
  LICENSED_NURSE: 'RN',
  NURSE_STUDENT: 'STN',
  MIGRATING_NURSE: 'MIG',
  REGULATORY_BODY: 'RGU',
  NURSE_ADVOCATE: 'ADV',
  ADMIN: 'ADM',
};

export const ROLE_TITLES: Record<UserRole, string> = {
  LICENSED_NURSE: 'Registered Nurse',
  NURSE_STUDENT: 'Student Nurse',
  MIGRATING_NURSE: 'Migrating Nurse',
  REGULATORY_BODY: 'Regulatory Body',
  NURSE_ADVOCATE: 'Nurse Advocate',
  ADMIN: 'Administrator',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  LICENSED_NURSE: '#10B981',
  NURSE_STUDENT: '#6366F1',
  MIGRATING_NURSE: '#F59E0B',
  REGULATORY_BODY: '#8B5CF6',
  NURSE_ADVOCATE: '#EC4899',
  ADMIN: '#EF4444',
};

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Basic exam questions (50/month)',
      'Migration tracker',
      'Dosage calculator',
      'Community access',
      'Basic profile',
      'Email support',
    ],
    limits: {
      examsPerMonth: 50,
      aiMessagesPerDay: 5,
      jobApplicationsPerMonth: 5,
      careerCoachingSessions: 0,
    },
  },
  pro: {
    name: 'Pro',
    price: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    features: [
      'Unlimited exam questions',
      'AI Study Tutor (Unlimited)',
      'AI Clinical Assistant',
      'Priority support',
      'Analytics dashboard',
      'Certificate verification',
      'Unlimited job applications',
      'Career coaching sessions',
      'Blockchain credentials',
      'Export all data',
    ],
    limits: {
      examsPerMonth: -1,
      aiMessagesPerDay: -1,
      jobApplicationsPerMonth: -1,
      careerCoachingSessions: 2,
    },
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    features: [
      'Everything in Pro',
      'Hospital recruitment tools',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Custom branding',
      'SSO integration',
      'Advanced analytics',
      'Priority feature requests',
      'Early access to new features',
    ],
    limits: {
      examsPerMonth: -1,
      aiMessagesPerDay: -1,
      jobApplicationsPerMonth: -1,
      careerCoachingSessions: -1,
    },
  },
};

export const HOSPITAL_LICENSE_TIERS = {
  basic: {
    name: 'Basic',
    price: 299,
    jobPostingsLimit: 5,
    nurseAccessLimit: 50,
    analyticsAccess: false,
    apiAccess: false,
  },
  professional: {
    name: 'Professional',
    price: 599,
    jobPostingsLimit: 20,
    nurseAccessLimit: 200,
    analyticsAccess: true,
    apiAccess: false,
  },
  enterprise: {
    name: 'Enterprise',
    price: 1499,
    jobPostingsLimit: -1,
    nurseAccessLimit: -1,
    analyticsAccess: true,
    apiAccess: true,
  },
};

export const VERIFICATION_FEES = {
  basic: 15,
  premium: 29,
  urgent: 49,
};

export const getTierColor = (tier: SubscriptionTier): string => {
  switch (tier) {
    case 'free': return '#6B7280';
    case 'pro': return '#8B5CF6';
    case 'enterprise': return '#F59E0B';
    default: return '#6B7280';
  }
};

export const getTierGradient = (tier: SubscriptionTier): string => {
  switch (tier) {
    case 'free': return 'from-slate-500 to-slate-600';
    case 'pro': return 'from-violet-500 to-purple-500';
    case 'enterprise': return 'from-amber-500 to-orange-500';
    default: return 'from-slate-500 to-slate-600';
  }
};

export function getUserSubscriptionTier(user: User | null): SubscriptionTier {
  if (!user) return 'free';
  if (user.subscription?.tier) return user.subscription.tier;
  if (user.hospitalClient) return 'enterprise';
  if (user.isCreator) return 'enterprise';
  return 'free';
}

export function isFeatureAccessible(user: User | null, feature: string): boolean {
  const tier = getUserSubscriptionTier(user);
  
  const featureAccess: Record<string, SubscriptionTier[]> = {
    'ai_tutor': ['pro', 'enterprise'],
    'ai_diagnosis': ['pro', 'enterprise'],
    'unlimited_exams': ['pro', 'enterprise'],
    'analytics': ['pro', 'enterprise'],
    'blockchain_credentials': ['pro', 'enterprise'],
    'hospital_tools': ['enterprise'],
    'api_access': ['enterprise'],
    'custom_branding': ['enterprise'],
    'dedicated_support': ['enterprise'],
  };
  
  const requiredTiers = featureAccess[feature];
  if (!requiredTiers) return true;
  
  return requiredTiers.includes(tier);
}

export const CREATOR_USER: User = {
  email: 'benjazzy003@gmail.com',
  name: 'Micah Benjamin Hassan',
  id: 'creator_nursphere_001',
  role: 'ADMIN',
  isCreator: true,
  creatorTitle: 'Revolutionizing Global Nursing',
  creatorBadge: 'Founder & Visionary',
  createdAt: new Date().toISOString(),
  verificationStatus: 'verified',
  isEmailVerified: true,
  hasCompletedOnboarding: true,
  securityLevel: 3,
  betaFeatures: ['ai_tutor', 'blockchain_credentials', 'live_qa', 'gamification'],
  unreadNotifications: 0,
  achievements: ['nclex_champion', 'week_warrior', 'global_nurse'],
  level: 50,
  xp: 45000,
  streak: 365,
  subscription: {
    tier: 'enterprise',
    status: 'active',
    startedAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

interface MigrationProgress {
  readinessScore: number;
  targetCountry: string;
  nclexStatus: string;
  ieltsStatus: string;
  credentialStatus: string;
  visaStatus: string;
}

interface ExamStats {
  total: number;
  averageScore: number;
  passRate: number;
  lastExam?: {
    date: string;
    score: number;
  };
}

interface ClinicalStats {
  totalHours: number;
  thisWeek: number;
  logsCount: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'tip' | 'beta' | 'news';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  icon?: string;
  actionUrl?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  migrationProgress: MigrationProgress | null;
  setMigrationProgress: (progress: MigrationProgress | null) => void;
  examStats: ExamStats | null;
  setExamStats: (stats: ExamStats | null) => void;
  clinicalStats: ClinicalStats | null;
  setClinicalStats: (stats: ClinicalStats | null) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[] | ((prev: Notification[]) => Notification[])) => void;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
  verifyEmail: (code: string) => Promise<boolean>;
  sendVerificationCode: () => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  showVerifyEmailModal: boolean;
  setShowVerifyEmailModal: (show: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | null>(null);
  const [examStats, setExamStats] = useState<ExamStats | null>(null);
  const [clinicalStats, setClinicalStats] = useState<ClinicalStats | null>(null);
  const [notificationsState, setNotificationsState] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const setNotifications = useCallback((value: Notification[] | ((prev: Notification[]) => Notification[])) => {
    if (typeof value === 'function') {
      setNotificationsState(value);
    } else {
      setNotificationsState(value);
    }
  }, []);

  const unreadCount = notificationsState.filter(n => !n.read).length;

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const sendVerificationCode = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
        }),
      });

      const data = await response.json();
      
      const code = data.code || generateVerificationCode();
      const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      
      updateUser({
        verificationCode: code,
        codeExpiry: expiry,
      });

      setNotifications([{
        id: `notif_verify_${Date.now()}`,
        type: 'info' as const,
        title: 'Verification Code',
        message: `Your code: ${code}`,
        read: false,
        createdAt: new Date().toISOString(),
      }, ...notificationsState]);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      const code = generateVerificationCode();
      const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      
      updateUser({
        verificationCode: code,
        codeExpiry: expiry,
      });
      
      console.log(`🔐 Verification code for ${user.email}: ${code}`);
      
      setNotifications([{
        id: `notif_verify_${Date.now()}`,
        type: 'info' as const,
        title: 'Verification Code (Offline)',
        message: `Your code is: ${code}`,
        read: false,
        createdAt: new Date().toISOString(),
      }, ...notificationsState]);
    }
  }, [user, updateUser, notificationsState, setNotifications]);

  const verifyEmail = useCallback(async (code: string): Promise<boolean> => {
    if (!user) return false;

    if (user.verificationCode && user.codeExpiry) {
      const isExpired = new Date(user.codeExpiry) < new Date();
      const localValid = code === user.verificationCode && !isExpired;
      
      if (localValid) {
        updateUser({
          isEmailVerified: true,
          verificationCode: undefined,
          codeExpiry: undefined,
          securityLevel: Math.min(user.securityLevel + 1, 3),
        });
        setShowVerifyEmailModal(false);
        
        setNotifications([{
          id: `notif_${Date.now()}`,
          type: 'success' as const,
          title: 'Email Verified!',
          message: 'Your email has been successfully verified. You now have full access to NurseSphere.',
          read: false,
          createdAt: new Date().toISOString(),
        }, ...notificationsState]);
        
        return true;
      }
    }

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-demo-code': user.verificationCode || '',
        },
        body: JSON.stringify({
          email: user.email,
          code,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        updateUser({
          isEmailVerified: true,
          verificationCode: undefined,
          codeExpiry: undefined,
          securityLevel: Math.min(user.securityLevel + 1, 3),
        });
        setShowVerifyEmailModal(false);
        
        setNotifications([{
          id: `notif_${Date.now()}`,
          type: 'success' as const,
          title: 'Email Verified!',
          message: 'Your email has been successfully verified. You now have full access to NurseSphere.',
          read: false,
          createdAt: new Date().toISOString(),
        }, ...notificationsState]);
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  }, [user, updateUser, setShowVerifyEmailModal, notificationsState, setNotifications]);

  const completeOnboarding = useCallback(async (data: OnboardingData) => {
    if (!user) return;
    
    updateUser({
      profile: {
        dateOfBirth: data.dateOfBirth,
        country: data.country,
        gender: data.gender,
        specialization: data.specialization,
        yearsOfExperience: data.yearsOfExperience,
        institution: data.institution,
        targetCountry: data.targetCountry,
        languages: data.languages,
        regulatorId: data.regulatorId,
        regulatorBody: data.regulatorBody,
      },
      hasCompletedOnboarding: true,
    });
    
    setShowOnboardingModal(false);
    
    if (!user.isEmailVerified) {
      await sendVerificationCode();
      setShowVerifyEmailModal(true);
    }
    
    setNotifications([{
      id: `notif_${Date.now()}`,
      type: 'tip' as const,
      title: 'Welcome to NurseSphere!',
      message: 'Complete your profile and verify your email to unlock all features and earn verification badges.',
      read: false,
      createdAt: new Date().toISOString(),
    }, ...notificationsState]);
  }, [user, updateUser, sendVerificationCode, notificationsState, setNotifications]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    setThemeState('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    
    if (savedToken) {
      setToken(savedToken);
    }
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        if (!parsedUser.isEmailVerified && parsedUser.hasCompletedOnboarding) {
          setShowVerifyEmailModal(true);
        } else if (!parsedUser.hasCompletedOnboarding) {
          setShowOnboardingModal(true);
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(
      notificationsState.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, [notificationsState, setNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications(notificationsState.map(n => ({ ...n, read: true }))    );
  }, [notificationsState, setNotifications]);

  const refreshUserData = useCallback(async () => {
    if (!token) return;
    
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
      const [migrationRes, examRes, clinicalRes, userRes] = await Promise.all([
        fetch(API_BASE_URL + '/api/migration/progress', { headers }).catch(() => null),
        fetch(API_BASE_URL + '/api/exams/stats', { headers }).catch(() => null),
        fetch(API_BASE_URL + '/api/clinical-logs/stats', { headers }).catch(() => null),
        fetch(API_BASE_URL + '/api/users/me', { headers }).catch(() => null),
      ]);

      if (migrationRes?.ok) {
        const data = await migrationRes.json();
        setMigrationProgress(data);
      }
      
      if (examRes?.ok) {
        const data = await examRes.json();
        setExamStats(data);
      }
      
      if (clinicalRes?.ok) {
        const data = await clinicalRes.json();
        setClinicalStats(data);
      }
      
      if (userRes?.ok) {
        const data = await userRes.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshUserData();
    } else {
      setIsLoading(false);
    }
  }, [token, refreshUserData]);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
    } else if (user || migrationProgress || examStats) {
      setIsLoading(false);
    }
  }, [token, user, migrationProgress, examStats]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updateUser,
      token,
      setToken,
      theme,
      setTheme,
      toggleTheme,
      migrationProgress,
      setMigrationProgress,
      examStats,
      setExamStats,
      clinicalStats,
      setClinicalStats,
      notifications: notificationsState,
      setNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      isLoading,
      refreshUserData,
      verifyEmail,
      sendVerificationCode,
      completeOnboarding,
      showVerifyEmailModal,
      setShowVerifyEmailModal,
      showOnboardingModal,
      setShowOnboardingModal,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
