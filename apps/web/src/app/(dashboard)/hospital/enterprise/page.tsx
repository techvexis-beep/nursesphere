'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Briefcase,
  Eye, Heart, Clock, DollarSign, MapPin, Star, CheckCircle2,
  Download, Calendar, Filter, Search, MoreVertical,
  ArrowUpRight, ArrowDownRight, Crown, Building, UserPlus,
  FileText, Shield, Zap, Globe, Award, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser, HOSPITAL_LICENSE_TIERS } from '@/context/UserContext';
import PremiumGate from '@/components/PremiumGate';

interface AnalyticsData {
  totalViews: number;
  totalApplications: number;
  totalHires: number;
  avgTimeToHire: number;
  candidateQuality: number;
  retentionRate: number;
  viewsTrend: number;
  applicationsTrend: number;
  hiresTrend: number;
  qualityTrend: number;
}

const DEMO_ANALYTICS: AnalyticsData = {
  totalViews: 12453,
  totalApplications: 847,
  totalHires: 23,
  avgTimeToHire: 18,
  candidateQuality: 87,
  retentionRate: 94,
  viewsTrend: 15.3,
  applicationsTrend: 8.7,
  hiresTrend: 12.5,
  qualityTrend: 3.2,
};

interface MonthlyData {
  month: string;
  views: number;
  applications: number;
  hires: number;
}

const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Sep', views: 3200, applications: 180, hires: 4 },
  { month: 'Oct', views: 4100, applications: 245, hires: 6 },
  { month: 'Nov', views: 3800, applications: 210, hires: 5 },
  { month: 'Dec', views: 2900, applications: 165, hires: 3 },
  { month: 'Jan', views: 5200, applications: 312, hires: 8 },
  { month: 'Feb', views: 4800, applications: 287, hires: 7 },
];

interface TopCandidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  matchScore: number;
  verified: boolean;
  appliedDate: string;
}

const TOP_CANDIDATES: TopCandidate[] = [
  { id: '1', name: 'Sarah Johnson', title: 'ICU RN, BSN', location: 'New York, NY', experience: '6 years', matchScore: 96, verified: true, appliedDate: '2 days ago' },
  { id: '2', name: 'Michael Chen', title: 'ER Nurse, MSN', location: 'Los Angeles, CA', experience: '4 years', matchScore: 93, verified: true, appliedDate: '3 days ago' },
  { id: '3', name: 'Emily Rodriguez', title: 'Pediatric RN, BSN', location: 'Chicago, IL', experience: '5 years', matchScore: 91, verified: true, appliedDate: '5 days ago' },
  { id: '4', name: 'David Kim', title: 'ICU Nurse, MSN', location: 'Seattle, WA', experience: '8 years', matchScore: 89, verified: false, appliedDate: '1 week ago' },
];

interface JobPerformance {
  id: string;
  title: string;
  department: string;
  views: number;
  applications: number;
  hires: number;
  conversionRate: number;
}

const JOB_PERFORMANCE: JobPerformance[] = [
  { id: '1', title: 'ICU Registered Nurse', department: 'Intensive Care', views: 3245, applications: 156, hires: 8, conversionRate: 5.1 },
  { id: '2', title: 'Emergency Room Nurse', department: 'Emergency', views: 2890, applications: 134, hires: 6, conversionRate: 4.5 },
  { id: '3', title: 'Pediatric Nurse', department: 'Pediatrics', views: 1823, applications: 89, hires: 4, conversionRate: 4.5 },
  { id: '4', title: 'OR Nurse', department: 'Surgery', views: 1456, applications: 67, hires: 3, conversionRate: 4.5 },
];

export default function EnterpriseDashboardPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'candidates' | 'jobs'>('overview');
  const [dateRange, setDateRange] = useState('30d');

  const isEnterprise = user?.hospitalClient?.licenseTier === 'enterprise';
  const tierColor = isEnterprise ? '#F59E0B' : '#8B5CF6';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'candidates', label: 'Top Candidates', icon: Users },
    { id: 'jobs', label: 'Job Performance', icon: Briefcase },
  ];

  const StatCard = ({ 
    title, 
    value, 
    trend, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    trend: number; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <div className="p-5 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{title}</span>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-muted border border-border"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
            style={{ background: `radial-gradient(circle, ${tierColor}40, transparent)` }}
          />
        </div>

        <div className="relative p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${tierColor}30, ${tierColor}10)`,
                  border: `1px solid ${tierColor}30`,
                }}
              >
                <Crown size={28} style={{ color: tierColor }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Enterprise Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {user?.hospitalClient?.hospitalName || 'Your Hospital'} Analytics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-primary/50 outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="secondary" className="flex items-center gap-2">
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Views" value={DEMO_ANALYTICS.totalViews.toLocaleString()} trend={DEMO_ANALYTICS.viewsTrend} icon={Eye} color="#6366F1" />
            <StatCard title="Applications" value={DEMO_ANALYTICS.totalApplications} trend={DEMO_ANALYTICS.applicationsTrend} icon={UserPlus} color="#8B5CF6" />
            <StatCard title="Total Hires" value={DEMO_ANALYTICS.totalHires} trend={DEMO_ANALYTICS.hiresTrend} icon={CheckCircle2} color="#10B981" />
            <StatCard title="Avg. Hire Time" value={`${DEMO_ANALYTICS.avgTimeToHire}d`} trend={-5.2} icon={Clock} color="#F59E0B" />
            <StatCard title="Candidate Quality" value={`${DEMO_ANALYTICS.candidateQuality}%`} trend={DEMO_ANALYTICS.qualityTrend} icon={Star} color="#EC4899" />
            <StatCard title="Retention Rate" value={`${DEMO_ANALYTICS.retentionRate}%`} trend={2.1} icon={Heart} color="#EF4444" />
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 p-1 bg-card rounded-xl w-fit overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon size={18} />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Hiring Pipeline</h3>
              <Target size={20} className="text-violet-400" />
            </div>
            
            <div className="space-y-4">
              {[
                { stage: 'Applied', count: 847, percentage: 100, color: '#6366F1' },
                { stage: 'Screened', count: 423, percentage: 50, color: '#8B5CF6' },
                { stage: 'Interviewed', count: 156, percentage: 18, color: '#F59E0B' },
                { stage: 'Offered', count: 45, percentage: 5, color: '#10B981' },
                { stage: 'Hired', count: 23, percentage: 3, color: '#EF4444' },
              ].map((stage, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{stage.stage}</span>
                    <span className="text-sm font-semibold text-foreground">{stage.count}</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Top Locations</h3>
              <Globe size={20} className="text-emerald-400" />
            </div>
            
            <div className="space-y-3">
              {[
                { city: 'New York, NY', count: 234, percentage: 28 },
                { city: 'Los Angeles, CA', count: 189, percentage: 22 },
                { city: 'Chicago, IL', count: 156, percentage: 18 },
                { city: 'Houston, TX', count: 134, percentage: 16 },
                { city: 'Phoenix, AZ', count: 134, percentage: 16 },
              ].map((location, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{location.city}</span>
                      <span className="text-xs text-muted-foreground/70">{location.count} candidates</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${location.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Monthly Trends</h3>
              <TrendingUp size={20} className="text-primary" />
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {MONTHLY_DATA.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 h-48 items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.views / 5200) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="flex-1 bg-gradient-to-t from-primary to-indigo-400 rounded-t-lg opacity-80"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.applications / 312) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 + 0.1 }}
                      className="flex-1 bg-gradient-to-t from-violet-500 to-violet-400 rounded-t-lg opacity-80"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.hires / 8) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                      className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.month}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-xs text-muted-foreground">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-violet-500" />
                <span className="text-xs text-muted-foreground">Applications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Hires</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Candidate Sources</h3>
              <div className="space-y-3">
                {[
                  { source: 'Direct Applications', count: 423, percentage: 50 },
                  { source: 'Referrals', count: 212, percentage: 25 },
                  { source: 'Job Boards', count: 127, percentage: 15 },
                  { source: 'Social Media', count: 85, percentage: 10 },
                ].map((source, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{source.source}</span>
                        <span className="text-xs text-muted-foreground/70">{source.count} ({source.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Specialty Distribution</h3>
              <div className="space-y-3">
                {[
                  { specialty: 'ICU / Critical Care', count: 234, percentage: 28 },
                  { specialty: 'Emergency Room', count: 189, percentage: 22 },
                  { specialty: 'Pediatrics', count: 156, percentage: 18 },
                  { specialty: 'Operating Room', count: 127, percentage: 15 },
                  { specialty: 'Med-Surg', count: 141, percentage: 17 },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{spec.specialty}</span>
                        <span className="text-xs text-muted-foreground/70">{spec.count}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                          style={{ width: `${spec.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'candidates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {TOP_CANDIDATES.map((candidate) => (
            <div key={candidate.id} className="p-5 rounded-2xl bg-card border border-border hover:border-border/80 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                  <Users size={24} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                    {candidate.verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <Shield size={10} />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{candidate.title}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/70">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {candidate.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {candidate.experience}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Applied {candidate.appliedDate}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-emerald-400">{candidate.matchScore}%</div>
                  <p className="text-xs text-muted-foreground/70">Match Score</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                <Button variant="outline" className="border-primary/30 text-primary flex-1">View Profile</Button>
                <Button variant="secondary" className="flex-1">Schedule Interview</Button>
                <Button variant="secondary" size="icon">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'jobs' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {JOB_PERFORMANCE.map((job) => (
            <div key={job.id} className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-emerald-400">{job.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground/70">Conversion</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Eye size={18} className="mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold text-foreground">{job.views.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground/70">Views</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <UserPlus size={18} className="mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold text-foreground">{job.applications}</p>
                  <p className="text-xs text-muted-foreground/70">Applications</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <CheckCircle2 size={18} className="mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold text-foreground">{job.hires}</p>
                  <p className="text-xs text-muted-foreground/70">Hires</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
