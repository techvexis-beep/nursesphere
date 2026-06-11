'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Users, Eye, Heart,
  Building, Plus, Search, Filter, MoreVertical,
  MapPin, Clock, DollarSign, ChevronRight,
  BarChart3, Settings, Bell, Crown, CheckCircle2,
  UserPlus, FileText, CreditCard, RefreshCw,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, HOSPITAL_LICENSE_TIERS, HospitalLicenseTier } from '@/context/UserContext';
import Link from 'next/link';
import PremiumGate from '@/components/PremiumGate';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  salary: string;
  applicants: number;
  views: number;
  status: 'active' | 'paused' | 'closed';
  postedAt: string;
  requirements: string[];
}

const DEMO_JOBS: JobPosting[] = [
  {
    id: '1',
    title: 'ICU Registered Nurse',
    department: 'Intensive Care Unit',
    location: 'New York, NY',
    type: 'full-time',
    salary: '$85,000 - $110,000/year',
    applicants: 24,
    views: 156,
    status: 'active',
    postedAt: '2024-01-15',
    requirements: ['BSN required', '2+ years ICU experience', 'BLS/ACLS certified'],
  },
  {
    id: '2',
    title: 'Emergency Room Nurse',
    department: 'Emergency Department',
    location: 'Los Angeles, CA',
    type: 'full-time',
    salary: '$90,000 - $115,000/year',
    applicants: 18,
    views: 203,
    status: 'active',
    postedAt: '2024-01-14',
    requirements: ['BSN required', 'ER experience preferred', 'BLS/ACLS/PALS certified'],
  },
  {
    id: '3',
    title: 'Pediatric Nurse',
    department: 'Pediatrics',
    location: 'Chicago, IL',
    type: 'part-time',
    salary: '$65,000 - $80,000/year',
    applicants: 12,
    views: 89,
    status: 'paused',
    postedAt: '2024-01-10',
    requirements: ['BSN required', 'Pediatric nursing experience', 'PALS certified'],
  },
];

const ANALYTICS_DATA = {
  totalViews: 448,
  totalApplicants: 54,
  activeJobs: 2,
  avgTimeToHire: '18 days',
  viewsChange: 12.5,
  applicantsChange: 8.3,
};

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  verified: boolean;
  experience: string;
  matchScore: number;
}

const DEMO_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Sarah Johnson', title: 'ICU RN', location: 'New York, NY', verified: true, experience: '5 years', matchScore: 94 },
  { id: '2', name: 'Michael Chen', title: 'ER Nurse', location: 'Los Angeles, CA', verified: true, experience: '3 years', matchScore: 87 },
  { id: '3', name: 'Emily Rodriguez', title: 'Pediatric RN', location: 'Chicago, IL', verified: false, experience: '4 years', matchScore: 82 },
  { id: '4', name: 'David Kim', title: 'ICU Nurse', location: 'Seattle, WA', verified: true, experience: '6 years', matchScore: 91 },
];

export default function HospitalPortalPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'candidates'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const hospitalTier: HospitalLicenseTier = user?.hospitalClient?.licenseTier || 'basic';
  const licenseInfo = HOSPITAL_LICENSE_TIERS[hospitalTier];
  const tierColor = hospitalTier === 'enterprise' ? '#F59E0B' : hospitalTier === 'professional' ? '#8B5CF6' : '#6B7280';

  const isEnterprise = hospitalTier === 'enterprise';
  const isProfessional = hospitalTier === 'professional' || isEnterprise;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
  ];

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
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${tierColor}30, ${tierColor}10)`,
                  border: `1px solid ${tierColor}30`,
                }}
              >
                <Building size={28} style={{ color: tierColor }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-foreground">Hospital Portal</h1>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${tierColor}20, ${tierColor}10)`,
                      color: tierColor,
                    }}
                  >
                    {licenseInfo.name} License
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user?.hospitalClient?.hospitalName || 'Your Hospital'} Recruitment Hub
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="bg-muted hover:bg-secondary text-muted-foreground hover:text-foreground">
                <Bell size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="bg-muted hover:bg-secondary text-muted-foreground hover:text-foreground">
                <Settings size={18} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground/70 uppercase tracking-wide">Job Postings</span>
                <Briefcase size={14} className="text-muted-foreground/70" />
              </div>
              <p className="text-2xl font-bold text-foreground">{ANALYTICS_DATA.activeJobs}</p>
              <p className="text-xs text-muted-foreground/70">
                of {licenseInfo.jobPostingsLimit === -1 ? '\u221E' : licenseInfo.jobPostingsLimit} allowed
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground/70 uppercase tracking-wide">Total Views</span>
                <Eye size={14} className="text-muted-foreground/70" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">{ANALYTICS_DATA.totalViews}</p>
                <span className="flex items-center text-xs text-emerald-400">
                  <ArrowUpRight size={12} />
                  {ANALYTICS_DATA.viewsChange}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground/70">This month</p>
            </div>
            <div className="p-4 rounded-xl bg-muted border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground/70 uppercase tracking-wide">Applicants</span>
                <UserPlus size={14} className="text-muted-foreground/70" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">{ANALYTICS_DATA.totalApplicants}</p>
                <span className="flex items-center text-xs text-emerald-400">
                  <ArrowUpRight size={12} />
                  {ANALYTICS_DATA.applicantsChange}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground/70">Total candidates</p>
            </div>
            <div className="p-4 rounded-xl bg-muted border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground/70 uppercase tracking-wide">Avg. Hire Time</span>
                <Clock size={14} className="text-muted-foreground/70" />
              </div>
              <p className="text-2xl font-bold text-foreground">{ANALYTICS_DATA.avgTimeToHire}</p>
              <p className="text-xs text-muted-foreground/70">Time to fill position</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 p-1 bg-card rounded-xl w-fit overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="whitespace-nowrap"
            >
              <Icon size={18} className="mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { icon: UserPlus, text: 'New application for ICU RN', time: '2 hours ago', color: 'emerald' },
                { icon: Eye, text: 'Job viewed 45 times today', time: '5 hours ago', color: 'violet' },
                { icon: CheckCircle2, text: 'Candidate shortlisted', time: '1 day ago', color: 'amber' },
                { icon: Briefcase, text: 'New job posting published', time: '2 days ago', color: 'blue' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${activity.color}-500/20`}>
                    <activity.icon size={18} className={`text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground/70">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Matching Candidates</h3>
            <div className="space-y-3">
              {DEMO_CANDIDATES.slice(0, 3).map((candidate) => (
                <div key={candidate.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Users size={18} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{candidate.name}</p>
                      {candidate.verified && (
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/70 truncate">{candidate.title} &bull; {candidate.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">{candidate.matchScore}%</div>
                    <p className="text-xs text-muted-foreground/70">match</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'jobs' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="pl-11"
              />
            </div>
            <Button>
              <Plus size={18} className="mr-2" />
              Post New Job
            </Button>
          </div>

          <div className="space-y-4">
            {DEMO_JOBS.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-card border border-border hover:border-border transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        job.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.department} &bull; {job.location}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical size={18} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign size={14} />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={14} />
                    {job.type}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requirements.map((req, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground">
                      {req}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users size={14} />
                      <span className="text-foreground font-medium">{job.applicants}</span> applicants
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye size={14} />
                      <span className="text-foreground font-medium">{job.views}</span> views
                    </div>
                  </div>
                  <Button variant="link" className="text-primary hover:text-primary/80 font-medium gap-1">
                    View Details <ChevronRight size={14} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'candidates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!isProfessional ? (
            <PremiumGate
              feature="hospital_tools"
              mode="upgrade"
              title="Candidate Database"
              description="Access our database of verified nurses"
              compact={false}
            >
              <div />
            </PremiumGate>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidates..."
                    className="pl-11"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary">
                    <Filter size={18} className="mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {DEMO_CANDIDATES.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-card border border-border hover:border-border transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                        <Users size={24} className="text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                          {candidate.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                              <CheckCircle2 size={12} />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{candidate.title} &bull; {candidate.experience} experience</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground/70">
                          <MapPin size={14} />
                          {candidate.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">{candidate.matchScore}%</div>
                        <p className="text-xs text-muted-foreground/70">Match Score</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                      <Button variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 flex-1 text-sm">
                        View Profile
                      </Button>
                      <Button variant="secondary" className="flex-1 text-sm">
                        Contact
                      </Button>
                      <Button variant="secondary" size="icon">
                        <MoreVertical size={18} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
