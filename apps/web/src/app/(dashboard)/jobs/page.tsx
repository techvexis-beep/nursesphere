'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Search, Bot, Building, Star, Home, DollarSign, ClipboardList,
  Users, Bookmark, Heart, Ruler, Briefcase, Tag, Bell, X,
  MapPin, ChevronRight, ArrowRight, CheckCircle2, Clock
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  hospital: string;
  location: string;
  country: string;
  salary: { min: number; max: number; currency: string };
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  expires: string;
  applicants: number;
  remote: boolean;
  featured: boolean;
  coordinates?: { lat: number; lng: number };
}

interface Hospital {
  id: string;
  name: string;
  logo: string;
  location: string;
  country: string;
  rating: number;
  beds: number;
}

const hospitals: Hospital[] = [
  { id: 'h1', name: 'Mayo Clinic', logo: '/images/icon-jobs.svg', location: 'Rochester, MN', country: 'USA', rating: 4.9, beds: 1248 },
  { id: 'h2', name: 'Cleveland Clinic', logo: '/images/icon-jobs.svg', location: 'Cleveland, OH', country: 'USA', rating: 4.8, beds: 1440 },
  { id: 'h3', name: 'Johns Hopkins Hospital', logo: '/images/icon-jobs.svg', location: 'Baltimore, MD', country: 'USA', rating: 4.9, beds: 1157 },
  { id: 'h4', name: 'UCL Hospitals', logo: '/images/icon-migration.svg', location: 'London', country: 'UK', rating: 4.7, beds: 1200 },
  { id: 'h5', name: 'Singapore General', logo: '/images/icon-wellness.svg', location: 'Singapore', country: 'Singapore', rating: 4.8, beds: 1800 },
  { id: 'h6', name: 'Royal Melbourne Hospital', logo: '/images/icon-exam.svg', location: 'Melbourne', country: 'Australia', rating: 4.7, beds: 800 },
];

const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior ICU Nurse',
    company: 'Mayo Clinic',
    hospital: 'Mayo Clinic',
    location: 'Rochester, MN',
    country: 'USA',
    salary: { min: 85000, max: 120000, currency: 'USD' },
    type: 'Full-time',
    category: 'Critical Care',
    description: 'Join our elite ICU team providing exceptional critical care. Work with cutting-edge technology and world-class physicians.',
    requirements: ['RN License', '3+ ICU Experience', 'BLS/ACLS', 'BSN Preferred'],
    benefits: ['Health Insurance', '401k', 'Relocation Bonus', 'Tuition Reimbursement'],
    posted: '2 days ago',
    expires: '30 days',
    applicants: 45,
    remote: false,
    featured: true,
  },
  {
    id: '2',
    title: 'Travel Nurse - Emergency Room',
    company: 'Cross Country Nurses',
    hospital: 'Multiple Locations',
    location: 'Multiple Cities',
    country: 'USA',
    salary: { min: 2500, max: 3200, currency: 'USD' },
    type: 'Contract',
    category: 'Emergency',
    description: 'Exciting travel nursing opportunities across the US. Competitive pay, housing stipends, and comprehensive benefits.',
    requirements: ['1+ Year ER Experience', 'RN License', 'Flexible', 'BLS/ACLS'],
    benefits: ['Housing Stipend', 'Travel Bonus', 'Health Insurance', '24/7 Support'],
    posted: '1 day ago',
    expires: '45 days',
    applicants: 128,
    remote: false,
    featured: true,
  },
  {
    id: '3',
    title: 'Labor & Delivery Nurse',
    company: 'Cleveland Clinic',
    hospital: 'Cleveland Clinic',
    location: 'Cleveland, OH',
    country: 'USA',
    salary: { min: 70000, max: 95000, currency: 'USD' },
    type: 'Full-time',
    category: 'Maternity',
    description: 'Be part of one of the nation\'s top maternity centers. Provide compassionate care to mothers and newborns.',
    requirements: ['RN License', 'L&D Experience', 'NCC Certified', 'BSN'],
    benefits: ['Sign-on Bonus', 'Health Insurance', 'Childcare Support', 'Wellness Program'],
    posted: '3 days ago',
    expires: '21 days',
    applicants: 67,
    remote: false,
    featured: false,
  },
  {
    id: '4',
    title: 'Pediatric Oncology Nurse',
    company: 'St. Jude Children\'s Research Hospital',
    hospital: 'St. Jude',
    location: 'Memphis, TN',
    country: 'USA',
    salary: { min: 75000, max: 105000, currency: 'USD' },
    type: 'Full-time',
    category: 'Pediatrics',
    description: 'Make a difference in children\'s lives. Work with cutting-edge pediatric oncology treatments.',
    requirements: ['RN License', 'Pediatric Experience', 'Oncology Certified', 'BSN'],
    benefits: ['Full Benefits', 'Loan Repayment', 'Relocation', 'Education Support'],
    posted: '5 days ago',
    expires: '60 days',
    applicants: 34,
    remote: false,
    featured: true,
  },
  {
    id: '5',
    title: 'NHS Staff Nurse - UK',
    company: 'NHS England',
    hospital: 'UCL Hospitals',
    location: 'London',
    country: 'UK',
    salary: { min: 28000, max: 36000, currency: 'GBP' },
    type: 'Full-time',
    category: 'General',
    description: 'Join the NHS and work in world-renowned hospitals across the UK. Sponsorship available.',
    requirements: ['NMC Registered', 'IELTS 7.0+', 'BSc Nursing', 'Experience Preferred'],
    benefits: ['Visa Sponsorship', 'NHS Pension', 'Annual Leave', 'Training'],
    posted: '1 week ago',
    expires: '90 days',
    applicants: 256,
    remote: false,
    featured: false,
  },
  {
    id: '6',
    title: 'Remote Nurse Educator',
    company: 'NurseSphere Academy',
    hospital: 'NurseSphere',
    location: 'Remote',
    country: 'Worldwide',
    salary: { min: 80000, max: 120000, currency: 'USD' },
    type: 'Remote',
    category: 'Education',
    description: 'Create online nursing courses and mentor students globally. Work from anywhere.',
    requirements: ['MSN', 'Teaching Experience', 'Tech Savvy', 'Excellent Communication'],
    benefits: ['Remote Work', 'Flexible Hours', 'Creative Freedom', 'Growth Opportunity'],
    posted: '3 days ago',
    expires: '14 days',
    applicants: 89,
    remote: true,
    featured: true,
  },
  {
    id: '7',
    title: 'Geriatric Care Nurse',
    company: 'Singapore Health Services',
    hospital: 'Singapore General Hospital',
    location: 'Singapore',
    country: 'Singapore',
    salary: { min: 65000, max: 85000, currency: 'SGD' },
    type: 'Full-time',
    category: 'Geriatrics',
    description: 'Join Asia\'s leading healthcare system. Excellent opportunities for career growth.',
    requirements: ['RN License', 'Geriatric Experience', 'Good English', 'Team Player'],
    benefits: ['Housing Allowance', 'Tax Benefits', 'Healthcare', 'Career Path'],
    posted: '4 days ago',
    expires: '45 days',
    applicants: 72,
    remote: false,
    featured: false,
  },
  {
    id: '8',
    title: 'Operating Room Nurse',
    company: 'Private Hospital Group',
    hospital: 'Royal Melbourne Hospital',
    location: 'Melbourne',
    country: 'Australia',
    salary: { min: 85000, max: 110000, currency: 'AUD' },
    type: 'Full-time',
    category: 'Surgery',
    description: 'Join Australia\'s top surgical team. Competitive salary and beautiful lifestyle.',
    requirements: ['RN License', 'OR Experience', 'AHPRA Registered', 'Postgrad Preferred'],
    benefits: ['Relocation Package', 'Salary Packaging', 'Professional Development'],
    posted: '6 days ago',
    expires: '60 days',
    applicants: 41,
    remote: false,
    featured: false,
  },
];

const jobCategories = [
  { id: 'all', name: 'All Jobs', icon: '/images/icon-jobs.svg', count: 1250 },
  { id: 'critical', name: 'Critical Care', icon: '/images/icon-ai.svg', count: 234 },
  { id: 'emergency', name: 'Emergency', icon: '/images/icon-exam.svg', count: 189 },
  { id: 'pediatrics', name: 'Pediatrics', icon: '/images/icon-wellness.svg', count: 156 },
  { id: 'maternity', name: 'Maternity', icon: '/images/icon-wellness.svg', count: 123 },
  { id: 'surgery', name: 'Surgery', icon: '/images/icon-exam.svg', count: 198 },
  { id: 'geriatrics', name: 'Geriatrics', icon: '/images/icon-wellness.svg', count: 87 },
  { id: 'mental', name: 'Mental Health', icon: '/images/icon-wellness.svg', count: 145 },
  { id: 'remote', name: 'Remote', icon: '/images/icon-migration.svg', count: 67 },
];

const countries = [
  { code: 'all', name: 'Worldwide', flag: '🌍' },
  { code: 'USA', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'Canada', name: 'Canada', flag: '🇨🇦' },
  { code: 'Australia', name: 'Australia', flag: '🇦🇺' },
  { code: 'Germany', name: 'Germany', flag: '🇩🇪' },
  { code: 'UAE', name: 'UAE', flag: '🇦🇪' },
  { code: 'Singapore', name: 'Singapore', flag: '🇸🇬' },
  { code: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'New Zealand', name: 'New Zealand', flag: '🇳🇿' },
];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('find');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [showPostJob, setShowPostJob] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState({
    specialty: 'General',
    experience: '1-3 years',
    salary: 80000,
    location: 'USA',
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.log('Location access denied')
      );
    }
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category.toLowerCase().includes(selectedCategory);
    const matchesCountry = selectedCountry === 'all' || job.country === selectedCountry || job.country === 'Worldwide';
    const matchesType = jobType === 'all' || job.type === jobType;
    const matchesSalary = job.salary.min >= salaryRange[0] && job.salary.max <= salaryRange[1];
    return matchesSearch && matchesCategory && matchesCountry && matchesType && matchesSalary;
  });

  const aiRecommendations = jobs
    .filter(job => {
      if (job.country === userProfile.location || userProfile.location === 'Worldwide') return true;
      return false;
    })
    .sort((a, b) => b.featured ? 1 : -1)
    .slice(0, 3);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const getAIRecommendation = (job: Job) => {
    const reasons = [];
    if (job.salary.min > userProfile.salary * 1.1) reasons.push('💰 Higher salary than current');
    if (job.country === userProfile.location) reasons.push('📍 Same country');
    if (job.remote) reasons.push('🏠 Remote-friendly');
    if (job.featured) reasons.push('⭐ Featured opportunity');
    if (job.applicants < 50) reasons.push('👥 Low competition');
    return reasons;
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    const format = (n: number) => {
      if (currency === 'USD' || currency === 'GBP' || currency === 'AUD') return `$${n.toLocaleString()}`;
      if (currency === 'SGD') return `S$${n.toLocaleString()}`;
      return n.toLocaleString();
    };
    return `${format(min)} - ${format(max)}`;
  };

  return (
    <div className="min-h-[calc(100vh-150px)]">
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .job-card {
          transition: all 0.3s ease;
        }
        .job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
        }
      `}</style>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Button
          onClick={() => setActiveTab('find')}
          variant={activeTab === 'find' ? 'default' : 'secondary'}
          className="flex items-center gap-2 px-7 py-3.5 text-[15px]"
        >
          <Search className="h-4 w-4" />
          Find Jobs
        </Button>
        <Button
          onClick={() => setActiveTab('ai')}
          variant={activeTab === 'ai' ? 'default' : 'secondary'}
          className="flex items-center gap-2 px-7 py-3.5 text-[15px]"
        >
          <Bot className="h-4 w-4" />
          AI Recommendations
        </Button>
        <Button
          onClick={() => setShowPostJob(true)}
          variant="success"
          className="flex items-center gap-2 px-7 py-3.5 text-[15px] md:ml-auto"
        >
          <Building className="h-4 w-4" />
          Post a Job
        </Button>
      </div>

      {activeTab === 'find' && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="bg-card border border-border/10 rounded-[20px] p-6 sticky top-[100px]">
              <h3 className="text-foreground font-semibold text-base mb-5">Filters</h3>
              
              <div className="mb-5">
                <label className="text-muted-foreground text-[13px] font-medium mb-2 block">
                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                  Location
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3.5 py-3 bg-card border border-border/50 rounded-xl text-foreground text-sm cursor-pointer"
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="text-muted-foreground text-[13px] font-medium mb-2 block">
                  <Ruler className="inline h-3.5 w-3.5 mr-1" />
                  Distance
                </label>
                <select
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(e.target.value)}
                  className="w-full px-3.5 py-3 bg-card border border-border/50 rounded-xl text-foreground text-sm cursor-pointer"
                >
                  <option value="all">Any Distance</option>
                  <option value="10">Within 10 miles</option>
                  <option value="25">Within 25 miles</option>
                  <option value="50">Within 50 miles</option>
                  <option value="100">Within 100 miles</option>
                  <option value="any">Anywhere</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="text-muted-foreground text-[13px] font-medium mb-2 block">
                  <Briefcase className="inline h-3.5 w-3.5 mr-1" />
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-3.5 py-3 bg-card border border-border/50 rounded-xl text-foreground text-sm cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground text-[13px] font-medium mb-3 block">
                  <Tag className="inline h-3.5 w-3.5 mr-1" />
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {jobCategories.slice(0, 6).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-xs cursor-pointer border transition-colors',
                        selectedCategory === cat.id
                          ? 'bg-primary/30 border-primary text-foreground'
                          : 'bg-card border-border/50 text-muted-foreground hover:bg-secondary'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search jobs, hospitals, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-4 px-5 h-auto bg-card border-border/50 text-foreground text-[15px] rounded-[14px]"
              />
            </div>

            <div className="flex justify-between items-center mb-5">
              <span className="text-muted-foreground text-sm">Showing {filteredJobs.length} jobs</span>
              <select className="px-3 py-2 bg-card border border-border/50 rounded-lg text-foreground text-[13px] cursor-pointer">
                <option>Sort by: Relevance</option>
                <option>Sort by: Date</option>
                <option>Sort by: Salary</option>
                <option>Sort by: Distance</option>
              </select>
            </div>

            <div className="flex flex-col gap-4">
              {filteredJobs.map((job, index) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="job-card bg-card border border-border/10 rounded-[20px] p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        {job.featured && (
                          <span className="bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 rounded-md text-[11px] font-semibold text-foreground flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            FEATURED
                          </span>
                        )}
                        <span className={cn(
                          'px-2.5 py-1 rounded-md text-[11px]',
                          job.remote
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-primary/20 text-primary'
                        )}>
                          {job.remote ? 'Remote' : 'On-site'}
                        </span>
                        <span className="text-muted-foreground/50 text-xs">{job.posted}</span>
                      </div>
                      
                      <h3 className="text-foreground font-semibold text-lg mb-1">{job.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{job.hospital} &bull; {job.location}</p>
                      
                      <div className="flex flex-wrap gap-4 mb-4">
                        <span className="text-green-500 font-semibold text-[15px] flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}{job.salary.currency === 'USD' && job.type === 'Contract' ? '/week' : '/year'}
                        </span>
                        <span className="text-primary flex items-center gap-1">
                          <ClipboardList className="h-4 w-4" />
                          {job.type}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applicants} applicants
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {job.requirements.slice(0, 3).map((req, i) => (
                          <span key={i} className="bg-card border border-border/10 px-2.5 py-1 rounded-md text-xs text-muted-foreground">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <Button variant="default">Apply Now</Button>
                      <Button
                        onClick={() => toggleSaveJob(job.id)}
                        variant={savedJobs.includes(job.id) ? 'warning' : 'secondary'}
                        className={cn(savedJobs.includes(job.id) && 'border-amber-500')}
                      >
                        {savedJobs.includes(job.id) ? <Heart className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
                        {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div>
          <div className="bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/20 rounded-2xl p-7 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Bot className="h-10 w-10 text-primary" />
              <div>
                <h2 className="text-foreground font-bold text-2xl m-0">AI Job Recommendations</h2>
                <p className="text-muted-foreground text-sm mt-1">Personalized opportunities based on your profile and preferences</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[13px]">Specialty:</span>
                <select
                  value={userProfile.specialty}
                  onChange={(e) => setUserProfile({...userProfile, specialty: e.target.value})}
                  className="px-2.5 py-1.5 bg-card border border-border/50 rounded-md text-foreground text-[13px]"
                >
                  <option>General</option>
                  <option>Critical Care</option>
                  <option>Emergency</option>
                  <option>Pediatrics</option>
                  <option>Mental Health</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[13px]">Target Country:</span>
                <select
                  value={userProfile.location}
                  onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
                  className="px-2.5 py-1.5 bg-card border border-border/50 rounded-md text-foreground text-[13px]"
                >
                  <option value="USA">🇺🇸 USA</option>
                  <option value="UK">🇬🇧 UK</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="Germany">🇩🇪 Germany</option>
                  <option value="UAE">🇦🇪 UAE</option>
                  <option value="Worldwide">🌍 Worldwide</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[13px]">Experience:</span>
                <select
                  value={userProfile.experience}
                  onChange={(e) => setUserProfile({...userProfile, experience: e.target.value})}
                  className="px-2.5 py-1.5 bg-card border border-border/50 rounded-md text-foreground text-[13px]"
                >
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
            </div>
          </div>

          <h3 className="text-foreground font-semibold text-lg mb-5 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Top Matches For You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {aiRecommendations.map(job => {
              const reasons = getAIRecommendation(job);
              return (
                <div key={job.id} className="bg-gradient-to-br from-primary/10 to-violet-500/5 border border-primary/20 rounded-[20px] p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-primary/30 px-2.5 py-1 rounded-md text-[11px] text-primary flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        AI Match
                      </span>
                    </div>
                    <span className="text-green-500 font-semibold text-[15px]">
                      {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}/yr
                    </span>
                  </div>

                  <h3 className="text-foreground font-semibold text-lg mb-1">{job.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{job.hospital} &bull; {job.location}</p>

                  <div className="mb-4">
                    {reasons.map((reason, i) => (
                      <div key={i} className="flex items-center gap-2 text-green-400 text-[13px] mb-1.5">
                        {reason}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2.5">
                    <Button variant="default" className="flex-1">Apply Now</Button>
                    <Button variant="secondary">Details</Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-card border border-border/10 rounded-[20px] p-6">
            <h3 className="text-foreground font-semibold text-lg mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Job Alerts
            </h3>
            <p className="text-muted-foreground text-sm mb-4">Get notified when new jobs match your preferences</p>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 py-3 h-auto bg-card border-border/50 text-foreground text-sm rounded-xl"
              />
              <Button variant="default">Enable Alerts</Button>
            </div>
          </div>
        </div>
      )}

      {showPostJob && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-5">
          <div className="bg-card rounded-2xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-foreground font-bold text-2xl m-0 flex items-center gap-2">
                <Building className="h-6 w-6" />
                Post a Job
              </h2>
              <Button
                onClick={() => setShowPostJob(false)}
                variant="ghost"
                size="icon"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form className="flex flex-col gap-4">
              <div>
                <label className="text-foreground/80 text-sm font-medium mb-2 block">Job Title *</label>
                <Input type="text" placeholder="e.g., ICU Nurse" className="w-full py-3 h-auto bg-card border-border/50 text-foreground text-sm rounded-xl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-foreground/80 text-sm font-medium mb-2 block">Hospital Name *</label>
                  <Input type="text" placeholder="Hospital name" className="w-full py-3 h-auto bg-card border-border/50 text-foreground text-sm rounded-xl" />
                </div>
                <div>
                  <label className="text-foreground/80 text-sm font-medium mb-2 block">Location *</label>
                  <Input type="text" placeholder="City, Country" className="w-full py-3 h-auto bg-card border-border/50 text-foreground text-sm rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-foreground/80 text-sm font-medium mb-2 block">Job Type *</label>
                  <select className="w-full py-3 px-3.5 bg-card border border-border/50 rounded-xl text-foreground text-sm">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-foreground/80 text-sm font-medium mb-2 block">Category *</label>
                  <select className="w-full py-3 px-3.5 bg-card border border-border/50 rounded-xl text-foreground text-sm">
                    {jobCategories.slice(1).map(cat => (
                      <option key={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-foreground/80 text-sm font-medium mb-2 block">Salary Min</label>
                  <Input type="number" placeholder="50000" className="w-full py-3 h-auto bg-card border-border/50 text-foreground text-sm rounded-xl" />
                </div>
                <div>
                  <label className="text-foreground/80 text-sm font-medium mb-2 block">Salary Max</label>
                  <Input type="number" placeholder="80000" className="w-full py-3 h-auto bg-card border-border/50 text-foreground text-sm rounded-xl" />
                </div>
              </div>

              <div>
                <label className="text-foreground/80 text-sm font-medium mb-2 block">Job Description *</label>
                <textarea rows={4} placeholder="Describe the job role and responsibilities..." className="w-full py-3 px-3.5 bg-card border border-border/50 rounded-xl text-foreground text-sm resize-y" />
              </div>

              <div>
                <label className="text-foreground/80 text-sm font-medium mb-2 block">Requirements (comma separated)</label>
                <Input type="text" placeholder="RN License, BLS, 2+ years experience" className="w-full py-3 h-auto bg-card border-border/50 text-foreground text-sm rounded-xl" />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="remote" className="accent-primary" />
                <label htmlFor="remote" className="text-muted-foreground text-sm">This is a remote position</label>
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={() => setShowPostJob(false)} variant="secondary" className="flex-1">Cancel</Button>
                <Button type="submit" variant="default" className="flex-1">Post Job</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
