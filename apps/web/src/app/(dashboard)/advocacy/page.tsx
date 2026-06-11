'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3, FileText, DollarSign, AlertTriangle, Ban,
  Moon, Scale, CheckCircle2, Info, Plus, X, Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface Report {
  id: string;
  reportType: string;
  hospitalName: string;
  country: string;
  city: string;
  description: string;
  isAnonymous: boolean;
  status: string;
  createdAt: string;
}

interface Stats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  totalSalaryReports: number;
}

const reportTypes = [
  { id: 'abuse', label: 'Workplace Abuse', icon: AlertTriangle, color: '#FF6B6B' },
  { id: 'underpayment', label: 'Underpayment', icon: DollarSign, color: '#FCA311' },
  { id: 'shift_overload', label: 'Shift Overload', icon: Moon, color: '#6C7AEB' },
  { id: 'discrimination', label: 'Discrimination', icon: Ban, color: '#FF6B6B' },
  { id: 'harassment', label: 'Harassment', icon: AlertTriangle, color: '#FF6B6B' },
  { id: 'unsafe_conditions', label: 'Unsafe Conditions', icon: AlertTriangle, color: '#FCA311' },
];

const countries = ['USA', 'UK', 'Canada', 'Nigeria', 'UAE', 'Saudi Arabia', 'Australia', 'Germany'];

export default function AdvocacyPage() {
  const [activeTab, setActiveTab] = useState<'report' | 'salary' | 'dashboard'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [formData, setFormData] = useState({
    reportType: '',
    hospitalName: '',
    country: '',
    city: '',
    description: '',
    evidence: '',
    isAnonymous: true,
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'report') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch(API_BASE_URL + '/api/advocacy/stats', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      });
      if (res.ok) setStats(await res.json());
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(API_BASE_URL + '/api/advocacy/reports', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      });
      if (res.ok) setReports(await res.json());
    } catch (error) {
      console.error('Failed to fetch reports');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(API_BASE_URL + '/api/advocacy/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          reportType: '',
          hospitalName: '',
          country: '',
          city: '',
          description: '',
          evidence: '',
          isAnonymous: true,
        });
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FCA311';
      case 'RESOLVED': return '#00C48C';
      case 'INVESTIGATING': return '#6C7AEB';
      default: return '#64748b';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Nurse Advocacy</h1>
        <p className="page-subtitle">Anonymous reporting and salary transparency for nurses</p>
      </div>

      <div className="flex gap-2 mb-8 bg-card p-2 rounded-xl shadow-sm">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'report', label: 'Report Issue', icon: FileText },
          { id: 'salary', label: 'Salary Data', icon: DollarSign },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
            className="flex-1"
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'dashboard' && stats && (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="stat-card" style={{ borderLeft: '4px solid #FCA311' }}>
              <div className="stat-label">Total Reports</div>
              <div className="stat-value">{stats.totalReports}</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid #FF6B6B' }}>
              <div className="stat-label">Pending</div>
              <div className="stat-value accent">{stats.pendingReports}</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid #00C48C' }}>
              <div className="stat-label">Resolved</div>
              <div className="stat-value success">{stats.resolvedReports}</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid #5568FE' }}>
              <div className="stat-label">Salary Reports</div>
              <div className="stat-value">{stats.totalSalaryReports}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="progress-section">
              <h2 className="section-title">Report an Issue</h2>
              <p className="text-muted-foreground/70 mb-6">
                Your voice matters. Report workplace issues anonymously to help improve conditions for all nurses.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {reportTypes.slice(0, 4).map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => { setFormData({ ...formData, reportType: type.id }); setShowForm(true); setActiveTab('report'); }}
                      className="p-5 border border-border rounded-xl cursor-pointer text-center transition-all hover:shadow-md"
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = type.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: type.color }} />
                      <div className="font-medium text-sm text-foreground">{type.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="progress-section">
              <h2 className="section-title">Your Impact</h2>
              <div className="flex flex-col gap-4 mt-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground">Reports Submitted</span>
                    <span className="text-primary font-semibold">{reports.length}</span>
                  </div>
                  <div className="h-1 bg-border rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(reports.length * 10, 100)}%` }}></div>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground">Anonymous Contributions</span>
                    <span className="text-emerald-500 font-semibold">100%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">All your reports are kept anonymous</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="animate-in fade-in duration-300">
          {!showForm ? (
            <div className="progress-section">
              <h2 className="section-title">Choose Report Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => { setFormData({ ...formData, reportType: type.id }); setShowForm(true); }}
                      className="p-6 border-2 border-border rounded-xl cursor-pointer text-center transition-all bg-card hover:shadow-lg"
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = type.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <Icon className="w-10 h-10 mx-auto mb-3" style={{ color: type.color }} />
                      <div className="font-semibold text-foreground">{type.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="progress-section animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="section-title flex items-center gap-2">
                  {(() => {
                    const rt = reportTypes.find(t => t.id === formData.reportType);
                    const Icon = rt?.icon;
                    return Icon ? <Icon className="w-5 h-5" /> : null;
                  })()}
                  {reportTypes.find(t => t.id === formData.reportType)?.label} Report
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {success ? (
                <div className="text-center py-12 animate-in zoom-in duration-500">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
                  <h3 className="text-2xl font-semibold text-emerald-500 mb-2">Report Submitted!</h3>
                  <p className="text-muted-foreground">Thank you for your courage. Your report has been submitted anonymously.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Hospital/Facility Name *</label>
                    <Input
                      type="text"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      required
                      placeholder="Enter facility name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select country</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Report Anonymously</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="text-muted-foreground">Keep my identity hidden</span>
                    </div>
                  </div>
                  <div className="md:col-span-2 form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={5}
                      placeholder="Describe the incident in detail..."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                    />
                  </div>
                  <div className="md:col-span-2 form-group">
                    <label className="form-label">Evidence (Optional)</label>
                    <textarea
                      value={formData.evidence}
                      onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                      rows={3}
                      placeholder="Any supporting evidence or details..."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-4">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {reports.length > 0 && !showForm && (
            <div className="progress-section mt-8">
              <h2 className="section-title">Your Reports</h2>
              <div className="flex flex-col gap-4 mt-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 bg-muted/50 rounded-lg" style={{ borderLeft: '4px solid #5568FE' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground capitalize">{report.reportType.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">{report.hospitalName} &bull; {report.city}, {report.country}</div>
                      </div>
                      <span
                        className="px-3 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${getStatusColor(report.status)}20`, color: getStatusColor(report.status) }}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="animate-in fade-in duration-300">
          <div className="progress-section">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="section-title">Salary Transparency Dashboard</h2>
              <Button onClick={() => document.getElementById('salary-form')?.scrollIntoView({ behavior: 'smooth' })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Salary Data
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {['USA', 'UK', 'Canada', 'Nigeria'].map((country) => (
                <div key={country} className="p-6 bg-muted/50 rounded-xl text-center">
                  <div className="text-3xl mb-2">
                    {country === 'USA' ? '\u{1F1FA}\u{1F1F8}' : country === 'UK' ? '\u{1F1EC}\u{1F1E7}' : country === 'Canada' ? '\u{1F1E8}\u{1F1E6}' : '\u{1F1F3}\u{1F1EC}'}
                  </div>
                  <div className="font-semibold text-foreground">{country}</div>
                  <div className="text-xl font-bold text-primary">$65K - $95K</div>
                  <div className="text-xs text-muted-foreground">Avg. Annual Salary</div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-lg mb-6">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Salary data is crowdsourced from nurses worldwide. Your contribution helps create transparency.
              </p>
            </div>
          </div>

          <div id="salary-form" className="progress-section">
            <h2 className="section-title">Contribute Salary Data</h2>
            <p className="text-muted-foreground/70 mb-6">Help other nurses by sharing salary information from your facility.</p>
            <SalaryForm />
          </div>
        </div>
      )}
    </div>
  );
}

function SalaryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '',
    country: '',
    city: '',
    department: '',
    shiftType: '',
    salaryMin: '',
    salaryMax: '',
    nurseToPatientRatio: '',
    benefits: '',
    isAnonymous: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(API_BASE_URL + '/api/advocacy/salary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          ...formData,
          salaryMin: parseInt(formData.salaryMin),
          salaryMax: parseInt(formData.salaryMax),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          hospitalName: '',
          country: '',
          city: '',
          department: '',
          shiftType: '',
          salaryMin: '',
          salaryMax: '',
          nurseToPatientRatio: '',
          benefits: '',
          isAnonymous: true,
        });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8 animate-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
        <p className="text-emerald-500 font-semibold">Thank you for contributing!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-group">
        <label className="form-label">Hospital Name</label>
        <Input type="text" value={formData.hospitalName} onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="form-label">Country</label>
        <select
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">City</label>
        <Input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="form-label">Department</label>
        <select
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select</option>
          <option value="ICU">ICU</option>
          <option value="Emergency">Emergency</option>
          <option value="Med-Surg">Med-Surg</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Labor & Delivery">Labor & Delivery</option>
          <option value="Operating Room">Operating Room</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Shift Type</label>
        <select
          value={formData.shiftType}
          onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select</option>
          <option value="Day">Day (12hr)</option>
          <option value="Night">Night (12hr)</option>
          <option value="Rotating">Rotating</option>
          <option value="8hr">8hr Shifts</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Min Salary (Annual)</label>
        <Input type="number" value={formData.salaryMin} onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })} required placeholder="50000" />
      </div>
      <div className="form-group">
        <label className="form-label">Max Salary (Annual)</label>
        <Input type="number" value={formData.salaryMax} onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })} required placeholder="80000" />
      </div>
      <div className="form-group">
        <label className="form-label">Nurse-to-Patient Ratio</label>
        <Input type="text" value={formData.nurseToPatientRatio} onChange={(e) => setFormData({ ...formData, nurseToPatientRatio: e.target.value })} placeholder="1:4" />
      </div>
      <div className="md:col-span-2 form-group">
        <label className="form-label">Benefits (Optional)</label>
        <Input type="text" value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} placeholder="Health insurance, 401k, etc." />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Submitting...' : 'Submit Salary Data'}
        </Button>
      </div>
    </form>
  );
}
