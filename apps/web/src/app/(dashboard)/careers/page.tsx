'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Briefcase, DollarSign, TrendingUp, Target, Star, BarChart3,
  Search, Globe, BookOpen, X, ArrowUpRight, MapPin, Sparkles,
  Bell, GraduationCap, Building, Stethoscope, Brain, Heart,
  Monitor, Plane,
} from 'lucide-react';

interface CareerRole {
  id: string;
  title: string;
  icon: string;
  description: string;
  salary: string;
  salaryRange: { min: number; max: number };
  growth: string;
  demand: 'high' | 'medium' | 'very-high';
  education: string;
  certifications: string[];
  location: string;
}

interface CareerCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ExternalJob {
  id: string;
  title: string;
  company: { name: string; logo?: string };
  location: string;
  isRemote: boolean;
  salary?: { min: number; max: number; display: string };
  jobType: string;
  url: string;
  publishedAt: string;
  source: string;
}

const careerCategories: CareerCategory[] = [
  { id: 'all', name: 'All', icon: '✨', color: '#6366F1' },
  { id: 'rn', name: 'RN', icon: '🏥', color: '#EC4899' },
  { id: 'aprn', name: 'Advanced', icon: '⚕️', color: '#10B981' },
  { id: 'specialist', name: 'Specialist', icon: '🎯', color: '#F59E0B' },
  { id: 'support', name: 'Support', icon: '🤝', color: '#8B5CF6' },
];

const careerRoles: CareerRole[] = [
  { id: '1', title: 'Registered Nurse (RN)', icon: '🏥', description: 'Provide patient care in various healthcare settings, administer medications, and coordinate with healthcare teams.', salary: '$94,480', salaryRange: { min: 63000, max: 130000 }, growth: '6%', demand: 'very-high', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['BLS', 'ACLS'], location: 'Hospitals, Clinics, Home Health' },
  { id: '2', title: 'Nurse Practitioner (NP)', icon: '⚕️', description: 'Diagnose illnesses, prescribe medications, and provide primary care services with advanced practice privileges.', salary: '$126,260', salaryRange: { min: 95000, max: 160000 }, growth: '40%', demand: 'very-high', education: 'Master of Science in Nursing (MSN) or DNP', certifications: ['FNP-BC', 'AG-ACNP'], location: 'Clinics, Hospitals, Private Practice' },
  { id: '3', title: 'Certified Registered Nurse Anesthetist', icon: '💉', description: 'Administer anesthesia and provide pain management services during surgical procedures.', salary: '$212,650', salaryRange: { min: 150000, max: 300000 }, growth: '12%', demand: 'high', education: 'Doctor of Nursing Practice (DNP)', certifications: ['CRNA', 'NBCRNA'], location: 'Hospitals, Surgical Centers' },
  { id: '4', title: 'Nurse Midwife (CNM)', icon: '👶', description: 'Provide primary healthcare to women, including prenatal care, childbirth, and postpartum care.', salary: '$123,780', salaryRange: { min: 90000, max: 165000 }, growth: '6%', demand: 'medium', education: 'Master of Science in Nursing (MSN)', certifications: ['CNM', 'ACNM'], location: 'Hospitals, Birth Centers, Private Practice' },
  { id: '5', title: 'Clinical Nurse Specialist', icon: '🔬', description: 'Provide expert consultation, lead quality improvement initiatives, and mentor nursing staff.', salary: '$118,330', salaryRange: { min: 85000, max: 155000 }, growth: '6%', demand: 'medium', education: 'MSN with CNS specialty or DNP', certifications: ['CNS-BC'], location: 'Hospitals, Academia' },
  { id: '6', title: 'Emergency Room Nurse', icon: '🚨', description: 'Provide immediate care to patients in emergency situations, triage patients, and stabilize critical cases.', salary: '$89,010', salaryRange: { min: 65000, max: 125000 }, growth: '6%', demand: 'very-high', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['CEN', 'BLS', 'ACLS'], location: 'Emergency Departments, Trauma Centers' },
  { id: '7', title: 'ICU Nurse', icon: '🫀', description: 'Care for critically ill patients requiring complex monitoring and life support systems.', salary: '$102,450', salaryRange: { min: 75000, max: 145000 }, growth: '6%', demand: 'very-high', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['CCRN', 'BLS', 'ACLS'], location: 'ICUs, Critical Care Units' },
  { id: '8', title: 'Operating Room Nurse', icon: '🩺', description: 'Assist surgeons during procedures, maintain sterile field, and ensure patient safety.', salary: '$96,660', salaryRange: { min: 70000, max: 135000 }, growth: '6%', demand: 'high', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['CNOR', 'BLS', 'ACLS'], location: 'Hospitals, Surgical Centers' },
  { id: '9', title: 'Pediatric Nurse', icon: '🧒', description: 'Provide care for infants, children, and adolescents in hospitals, clinics, and private practices.', salary: '$85,620', salaryRange: { min: 60000, max: 120000 }, growth: '6%', demand: 'high', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['CPN', 'BLS', 'PALS'], location: 'Pediatric Hospitals, Clinics' },
  { id: '10', title: 'Psychiatric Mental Health Nurse', icon: '🧠', description: 'Assess mental health conditions, develop treatment plans, and provide therapy to patients.', salary: '$99,660', salaryRange: { min: 70000, max: 140000 }, growth: '6%', demand: 'high', education: 'MSN with PMHNP or DNP', certifications: ['PMHNP-BC', 'RN-BC'], location: 'Mental Health Facilities, Hospitals' },
  { id: '11', title: 'Nurse Educator', icon: '📚', description: 'Teach aspiring nurses in academic settings and provide clinical education to practicing nurses.', salary: '$87,530', salaryRange: { min: 60000, max: 125000 }, growth: '6%', demand: 'high', education: 'MSN or DNP with education focus', certifications: ['CNE', 'BLS'], location: 'Universities, Colleges, Hospitals' },
  { id: '12', title: 'Nurse Informaticist', icon: '💻', description: 'Analyze healthcare data, implement EHR systems, and optimize nursing workflows through technology.', salary: '$106,680', salaryRange: { min: 78000, max: 150000 }, growth: '6%', demand: 'high', education: 'MSN in Nursing Informatics', certifications: ['RN-BC', 'CAHIMS'], location: 'Hospitals, Healthcare IT Companies' },
  { id: '13', title: 'Travel Nurse', icon: '✈️', description: 'Work temporary assignments in various healthcare facilities across different locations.', salary: '$108,930', salaryRange: { min: 80000, max: 165000 }, growth: '6%', demand: 'very-high', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['BLS', 'ACLS', 'Specialty'], location: 'Various Healthcare Facilities' },
  { id: '14', title: 'Oncology Nurse', icon: '🎗️', description: 'Provide care to cancer patients, administer chemotherapy, and support patients through treatment.', salary: '$96,230', salaryRange: { min: 70000, max: 135000 }, growth: '6%', demand: 'high', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['OCN', 'BLS', 'CHEMO'], location: 'Cancer Centers, Hospitals' },
  { id: '15', title: 'Dialysis Nurse', icon: '🫘', description: 'Care for patients undergoing dialysis treatment for kidney failure.', salary: '$86,540', salaryRange: { min: 62000, max: 120000 }, growth: '6%', demand: 'high', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['CNN', 'BLS'], location: 'Dialysis Centers, Hospitals' },
  { id: '16', title: 'Licensed Practical Nurse (LPN)', icon: '📋', description: 'Provide basic patient care under RN supervision in various healthcare settings.', salary: '$55,560', salaryRange: { min: 40000, max: 75000 }, growth: '6%', demand: 'high', education: 'Practical Nursing Diploma', certifications: ['BLS', 'State NCLEX-PN'], location: 'Nursing Homes, Clinics, Home Health' },
  { id: '17', title: 'Certified Nursing Assistant (CNA)', icon: '🤲', description: 'Assist patients with daily activities, take vital signs, and support nursing staff.', salary: '$38,200', salaryRange: { min: 28000, max: 52000 }, growth: '4%', demand: 'very-high', education: 'CNA Certification (4-12 weeks)', certifications: ['State CNA Certification', 'BLS'], location: 'Hospitals, Nursing Homes, Home Health' },
  { id: '18', title: 'Nurse Administrator', icon: '👔', description: 'Manage nursing departments, coordinate healthcare services, and oversee staff development.', salary: '$118,800', salaryRange: { min: 85000, max: 175000 }, growth: '6%', demand: 'high', education: 'MSN in Healthcare Administration', certifications: ['NEA-BC', 'FACHE'], location: 'Hospitals, Healthcare Systems' },
  { id: '19', title: 'School Nurse', icon: '🏫', description: 'Provide healthcare services to students, manage medications, and promote student wellness.', salary: '$62,330', salaryRange: { min: 45000, max: 95000 }, growth: '4%', demand: 'medium', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['BLS', 'State School Nurse Cert'], location: 'Schools, School Districts' },
  { id: '20', title: 'Forensic Nurse', icon: '🔍', description: 'Provide care to crime victims, collect evidence, and work with law enforcement agencies.', salary: '$82,450', salaryRange: { min: 60000, max: 120000 }, growth: '6%', demand: 'medium', education: 'Bachelor of Science in Nursing (BSN)', certifications: ['SANE-A', 'SANE-P'], location: 'Hospitals, Law Enforcement, Legal' },
];

const salaryTrends = [
  { year: '2020', value: 77600 },
  { year: '2021', value: 78500 },
  { year: '2022', value: 82450 },
  { year: '2023', value: 86200 },
  { year: '2024', value: 90100 },
  { year: '2025', value: 94480 },
];

const demoJobs: ExternalJob[] = Array.from({ length: 20 }, (_, i) => ({
  id: `job_${i}`,
  title: ['Registered Nurse', 'Nurse Practitioner', 'ICU Nurse', 'ER Nurse', 'Pediatric Nurse', 'Operating Room Nurse', 'Home Health Nurse', 'Travel Nurse', 'Dialysis Nurse', 'Oncology Nurse'][i % 10],
  company: { name: ['Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins', 'UCLA Health', 'Cedars-Sinai', 'Mass General', 'Duke Hospital', 'Northwestern', 'UCSF Medical', 'NewYork-Presbyterian'][i % 10] },
  location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'][i % 10],
  isRemote: i % 5 === 0,
  salary: { min: 50000 + i * 3000, max: 80000 + i * 5000, display: `$${(50 + i * 3)}K - $${(80 + i * 5)}K` },
  jobType: ['Full-time', 'Part-time', 'Contract', 'Per Diem'][i % 4],
  url: '#',
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  source: 'demo'
}));

function getDemandColor(demand: string) {
  switch(demand) {
    case 'very-high': return '#EF4444';
    case 'high': return '#F59E0B';
    case 'medium': return '#10B981';
    default: return '#64748B';
  }
}

function getDemandLabel(demand: string) {
  switch(demand) {
    case 'very-high': return 'Very High';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    default: return 'Normal';
  }
}

export default function CareersPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'salary' | 'growth'>('salary');
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'careers'>('live');
  const [externalJobs] = useState<ExternalJob[]>(demoJobs);
  const [selectedJob, setSelectedJob] = useState<ExternalJob | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredRoles = careerRoles
    .filter(role => {
      if (selectedCategory !== 'all') {
        const categoryMatch =
          (selectedCategory === 'rn' && role.title.includes('Nurse') && !role.title.includes('Practitioner') && !role.title.includes('Anesthetist') && !role.title.includes('Midwife') && !role.title.includes('Specialist')) ||
          (selectedCategory === 'aprn' && (role.title.includes('Practitioner') || role.title.includes('Anesthetist') || role.title.includes('Midwife') || role.title.includes('Clinical Nurse Specialist'))) ||
          (selectedCategory === 'specialist' && (role.title.includes('Pediatric') || role.title.includes('Psychiatric') || role.title.includes('Oncology') || role.title.includes('Dialysis') || role.title.includes('Emergency') || role.title.includes('ICU') || role.title.includes('Operating') || role.title.includes('Informaticist') || role.title.includes('Educator'))) ||
          (selectedCategory === 'support' && (role.title.includes('Practical') || role.title.includes('Assistant') || role.title.includes('Administrator')));
        if (!categoryMatch) return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return role.title.toLowerCase().includes(query) ||
               role.description.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'salary') return b.salaryRange.max - a.salaryRange.max;
      return parseFloat(b.growth) - parseFloat(a.growth);
    });

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="bg-muted rounded-xl h-[60px] w-[300px] mb-6" />
        <div className="grid grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="bg-muted rounded-2xl h-[280px]" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto"
    >
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold mb-1.5 font-heading text-foreground flex items-center gap-2">
          <Briefcase className="w-7 h-7" />
          Nursing Careers
        </h1>
        <p className="text-muted-foreground text-sm">
          Explore career paths, salaries, and growth opportunities in nursing
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Avg. Salary', value: '$94,480', color: '#10B981', icon: DollarSign },
          { label: 'Job Growth', value: '6%', color: '#F59E0B', icon: TrendingUp },
          { label: 'Open Jobs', value: '203K', color: '#6366F1', icon: Target },
          { label: 'Top Role', value: 'NP', color: '#EC4899', icon: Star },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 text-center">
              <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-[22px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-7">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2 font-heading">
            <BarChart3 className="w-4 h-4" />
            Salary Trend (Avg. RN)
          </h3>
          <span className="text-xs text-muted-foreground">Source: BLS 2025</span>
        </div>
        <div className="flex items-end gap-2 h-[120px]">
          {salaryTrends.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-[6px_6px_0_0] transition-all duration-500"
                style={{ height: `${(item.value / 100000) * 100}px`, minHeight: '20px' }}
              />
              <span className="text-[11px] text-muted-foreground">${(item.value / 1000).toFixed(0)}K</span>
              <span className="text-[10px] font-semibold text-foreground">{item.year}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
          <h2 className="text-[22px] font-bold text-foreground font-heading flex items-center gap-2">
            {activeTab === 'live' ? <><Bell className="w-5 h-5" /> Live Nursing Jobs</> : <><BookOpen className="w-5 h-5" /> Career Paths</>}
          </h2>
          {activeTab === 'live' && (
            <Badge variant="success" className="rounded-full text-xs font-semibold">
              {externalJobs.length}+ Jobs Available
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab('live')}
            variant={activeTab === 'live' ? 'default' : 'outline'}
            size="sm"
          >
            <Globe className="w-4 h-4 mr-1.5" />
            Live Jobs
          </Button>
          <Button
            onClick={() => setActiveTab('careers')}
            variant={activeTab === 'careers' ? 'default' : 'outline'}
            size="sm"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            Careers
          </Button>
        </div>
      </div>

      {activeTab === 'live' ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 mb-8">
          {externalJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setSelectedJob(job)}
              className="bg-card border border-border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-foreground mb-1 font-heading">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">{job.company.name}</p>
                </div>
                {job.isRemote && (
                  <Badge variant="outline" className="border-indigo-500/20 bg-indigo-500/10 text-indigo-400 rounded-full text-[11px] font-semibold">
                    Remote
                  </Badge>
                )}
              </div>
              <div className="flex gap-4 mb-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.jobType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-emerald-500">{job.salary?.display || 'Competitive'}</span>
                <span className="text-xs text-muted-foreground">{new Date(job.publishedAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {[{ id: 'salary', label: 'Salary', icon: DollarSign, color: '#10B981' }, { id: 'growth', label: 'Growth', icon: TrendingUp, color: '#F59E0B' }].map(sort => {
                const Icon = sort.icon;
                const isActive = sortBy === sort.id;
                return (
                  <Button
                    key={sort.id}
                    onClick={() => setSortBy(sort.id as 'salary' | 'growth')}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className={isActive ? '' : ''}
                    style={isActive ? { backgroundColor: sort.color, borderColor: sort.color } : {}}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {sort.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2.5 mb-7 overflow-x-auto pb-2">
            {careerCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-[18px] py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap transition-all',
                  selectedCategory === cat.id
                    ? 'text-white border-transparent'
                    : 'bg-card text-muted-foreground border-border hover:bg-accent'
                )}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-[18px] mb-8">
            {filteredRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedRole(role)}
                className="bg-card border border-border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-primary"
              >
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 flex items-center justify-center text-2xl">
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground mb-1 font-heading">{role.title}</h3>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: getDemandColor(role.demand) + '20', color: getDemandColor(role.demand) }}
                    >
                      {getDemandLabel(role.demand)} Demand
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3.5 line-clamp-2">
                  {role.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3.5">
                  <div className="bg-muted p-3 rounded-xl text-center">
                    <div className="text-base font-bold text-emerald-500">
                      ${(role.salaryRange.min / 1000).toFixed(0)}K - ${(role.salaryRange.max / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[10px] text-muted-foreground">Salary Range</div>
                  </div>
                  <div className="bg-muted p-3 rounded-xl text-center">
                    <div className="text-base font-bold text-amber-500">{role.growth}</div>
                    <div className="text-[10px] text-muted-foreground">Job Growth</div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {role.certifications.slice(0, 3).map((cert, i) => (
                    <Badge key={i} variant="outline" className="text-indigo-400 border-indigo-500/20 bg-indigo-500/10 text-[10px] font-semibold">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {filteredRoles.length === 0 && activeTab === 'careers' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-card border border-border rounded-2xl"
        >
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-bold mb-2 text-foreground font-heading">No careers found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </motion.div>
      )}

      <div className="p-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl text-white text-center mt-8">
        <Briefcase className="w-10 h-10 mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2 font-heading">Get Career Guidance</h3>
        <p className="opacity-90 mb-5 text-sm">Subscribe for personalized career advice and job alerts</p>
        <div className="flex gap-2.5 max-w-[360px] mx-auto flex-wrap justify-center">
          <Input
            type="email"
            placeholder="Your email"
            className="flex-1 min-w-[180px] bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
          <Button variant="secondary" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90">
            Subscribe
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-8 max-w-[700px] w-full max-h-[90vh] overflow-auto relative"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-[22px] font-bold text-foreground font-heading">{selectedJob.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedJob.company.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-xl text-center">
                  <div className="text-lg font-bold text-emerald-500">{selectedJob.salary?.display}</div>
                  <div className="text-xs text-muted-foreground">Salary Range</div>
                </div>
                <div className="bg-muted p-4 rounded-xl text-center">
                  <div className="text-lg font-bold text-foreground">{selectedJob.jobType}</div>
                  <div className="text-xs text-muted-foreground">Job Type</div>
                </div>
                <div className="bg-muted p-4 rounded-xl text-center">
                  <div className="text-lg font-bold text-foreground">{selectedJob.location}</div>
                  <div className="text-xs text-muted-foreground">Location</div>
                </div>
                <div className="bg-muted p-4 rounded-xl text-center">
                  <div className="text-lg font-bold" style={{ color: selectedJob.isRemote ? '#6366F1' : undefined }}>
                    {selectedJob.isRemote ? 'Remote' : 'On-site'}
                  </div>
                  <div className="text-xs text-muted-foreground">Work Type</div>
                </div>
              </div>
              <Link
                href={selectedJob.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'default' }), 'w-full gap-2')}
              >
                <ArrowUpRight className="w-4 h-4" />
                Apply Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
