'use client';

import { useState, useEffect } from 'react';
import { Loader2, Wifi, CheckCircle2, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface ClinicalLog {
  id: string;
  caseTitle: string;
  caseType: string;
  description: string;
  patientAge: number | null;
  patientGender: string | null;
  diagnosis: string | null;
  intervention: string | null;
  outcome: string | null;
  supervisorName: string | null;
  supervisorApproval: boolean;
  isVerified: boolean;
  createdAt: string;
}

const caseTypes = [
  'Patient Assessment',
  'Medication Administration',
  'Wound Care',
  'IV Therapy',
  'Patient Education',
  'Emergency Response',
  'Vital Signs Monitoring',
  'Health History',
  'Discharge Planning',
  'Other',
];

const mockLogs: ClinicalLog[] = [
  {
    id: '1',
    caseTitle: 'Patient Assessment - Mr. Johnson',
    caseType: 'Patient Assessment',
    description: 'Conducted comprehensive assessment of a 65-year-old male patient admitted with chest pain. Performed vital signs, cardiac monitoring, and collected health history.',
    patientAge: 65,
    patientGender: 'Male',
    diagnosis: 'Acute Coronary Syndrome',
    intervention: 'ECG, IV access, medication administration',
    outcome: 'Stable transferred to cardiac unit',
    supervisorName: 'Dr. Sarah Williams',
    supervisorApproval: true,
    isVerified: true,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    caseTitle: 'Wound Care - Ms. Thompson',
    caseType: 'Wound Care',
    description: 'Performed dressing change on surgical wound. Assessed for signs of infection, cleaned wound, and applied new dressing.',
    patientAge: 45,
    patientGender: 'Female',
    diagnosis: 'Post-surgical wound',
    intervention: 'Wound cleaning, dressing change',
    outcome: 'Healing well',
    supervisorName: 'Nurse Mary Chen',
    supervisorApproval: true,
    isVerified: true,
    createdAt: '2024-01-14T14:00:00Z',
  },
  {
    id: '3',
    caseTitle: 'Medication Administration - Mr. Davis',
    caseType: 'Medication Administration',
    description: 'Administered IV antibiotics and pain medication. Monitored for adverse reactions.',
    patientAge: 52,
    patientGender: 'Male',
    diagnosis: 'Pneumonia',
    intervention: 'IV antibiotic administration, pain management',
    outcome: 'Improving',
    supervisorName: null,
    supervisorApproval: false,
    isVerified: false,
    createdAt: '2024-01-16T09:15:00Z',
  },
];

export default function LogbookPage() {
  const [logs, setLogs] = useState<ClinicalLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [formData, setFormData] = useState({
    caseTitle: '',
    caseType: '',
    description: '',
    patientAge: '',
    patientGender: '',
    diagnosis: '',
    intervention: '',
    outcome: '',
    supervisorName: '',
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(API_BASE_URL + '/api/clinical-logs', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else {
        setApiError(true);
        setLogs(mockLogs);
      }
    } catch (error) {
      console.log('Using mock data - API not available');
      setApiError(true);
      setLogs(mockLogs);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const newLog: ClinicalLog = {
      id: Date.now().toString(),
      caseTitle: formData.caseTitle,
      caseType: formData.caseType,
      description: formData.description,
      patientAge: formData.patientAge ? parseInt(formData.patientAge) : null,
      patientGender: formData.patientGender || null,
      diagnosis: formData.diagnosis || null,
      intervention: formData.intervention || null,
      outcome: formData.outcome || null,
      supervisorName: formData.supervisorName || null,
      supervisorApproval: false,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(API_BASE_URL + '/api/clinical-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          ...formData,
          patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
        }),
      });

      if (res.ok) {
        const createdLog = await res.json();
        setLogs([createdLog, ...logs]);
      } else {
        setLogs([newLog, ...logs]);
      }
    } catch (error) {
      setLogs([newLog, ...logs]);
    } finally {
      setShowForm(false);
      setFormData({
        caseTitle: '',
        caseType: '',
        description: '',
        patientAge: '',
        patientGender: '',
        diagnosis: '',
        intervention: '',
        outcome: '',
        supervisorName: '',
      });
      setSaving(false);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return;

    try {
      await fetch(`${API_BASE_URL}/api/clinical-logs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
    } catch (error) {
      console.log('API not available, local delete');
    }
    setLogs(logs.filter(l => l.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {apiError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-5 text-amber-500 text-sm">
          <Wifi size={16} />
          Demo Mode - Showing sample data. Connect to API for real data.
        </div>
      )}

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clinical Logbook</h1>
          <p className="text-muted-foreground/70 mt-1">Document your clinical experiences</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/40"
        >
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Entry'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-card rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold text-foreground mb-5">New Clinical Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Case Title *</label>
              <Input
                type="text"
                value={formData.caseTitle}
                onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                required
                placeholder="e.g., Patient Assessment - Mr. Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Case Type *</label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select type</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                placeholder="Describe the clinical situation, your observations, and actions taken..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Patient Age</label>
              <Input
                type="number"
                value={formData.patientAge}
                onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                placeholder="e.g., 45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Patient Gender</label>
              <select
                value={formData.patientGender}
                onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Diagnosis/Nursing Diagnosis</label>
              <Input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g., Risk for infection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Intervention</label>
              <Input
                type="text"
                value={formData.intervention}
                onChange={(e) => setFormData({ ...formData, intervention: e.target.value })}
                placeholder="What did you do?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Outcome</label>
              <Input
                type="text"
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                placeholder="Patient outcome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Supervisor Name</label>
              <Input
                type="text"
                value={formData.supervisorName}
                onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                placeholder="Supervisor's full name"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 flex-wrap">
              <Button type="submit" disabled={saving} className="min-w-[140px]">
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl text-center">
          <div className="text-3xl font-bold text-primary">{logs.length}</div>
          <div className="text-sm text-muted-foreground">Total Entries</div>
        </div>
        <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-2xl text-center">
          <div className="text-3xl font-bold text-emerald-500">{logs.filter(l => l.isVerified).length}</div>
          <div className="text-sm text-muted-foreground">Verified</div>
        </div>
        <div className="p-5 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-2xl text-center">
          <div className="text-3xl font-bold text-amber-500">{logs.filter(l => !l.supervisorApproval).length}</div>
          <div className="text-sm text-muted-foreground">Pending Approval</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h2>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl">
            <p>No clinical logs yet. Add your first entry!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {logs.map((log) => (
              <div key={log.id} className="p-5 border border-border rounded-2xl bg-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-semibold text-foreground">{log.caseTitle}</h3>
                      {log.isVerified && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-0.5 rounded-full text-xs font-medium">
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      )}
                      {!log.supervisorApproval && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-0.5 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{log.caseType}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLog(log.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </Button>
                </div>
                <p className="mb-4 text-muted-foreground/80 leading-relaxed">{log.description}</p>
                <div className="flex gap-6 text-sm text-muted-foreground flex-wrap">
                  {log.patientAge && <span>Age: {log.patientAge}</span>}
                  {log.patientGender && <span>Gender: {log.patientGender}</span>}
                  {log.diagnosis && <span>Diagnosis: {log.diagnosis}</span>}
                  {log.supervisorName && <span>Supervisor: {log.supervisorName}</span>}
                </div>
                <p className="text-xs text-muted-foreground/50 mt-4">
                  {new Date(log.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
