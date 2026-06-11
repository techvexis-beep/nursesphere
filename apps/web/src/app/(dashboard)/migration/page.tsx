'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { CountrySelector } from '@/components/migration/CountrySelector';
import { RegulatorSelector } from '@/components/migration/RegulatorSelector';
import TrackerCard from '@/components/migration/TrackerCard';
import { AskRegulatorModal } from '@/components/migration/AskRegulatorModal';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Lock, DollarSign, Clock, TrendingUp, Globe, ArrowRight } from 'lucide-react';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface MigrationProgress {
  id: string;
  targetCountry: string;
  nclexStatus: string;
  nclexDate: string | null;
  nclexScore: number | null;
  ieltsStatus: string;
  ieltsDate: string | null;
  ieltsScore: number | null;
  oetStatus: string;
  oetDate: string | null;
  oetScore: number | null;
  credentialEvalStatus: string;
  credentialEvalDate: string | null;
  visaStatus: string;
  visaDate: string | null;
  costEstimate: number | null;
  readinessScore: number;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  regulatorCount: number;
}

interface Regulator {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  region: string | null;
  _count: {
    pathways: number;
    liveSessions: number;
    tracking: number;
  };
}

interface Pathway {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  steps: string;
  documents: string;
  fees: string;
  timeline: string | null;
  examRequired: boolean;
  examName: string | null;
  englishRequired: boolean;
  englishTests: string | null;
}

const statusOptions = [
  { value: 'NOT_STARTED', label: 'Not Started', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.2)' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
  { value: 'COMPLETED', label: 'Completed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
];

const DEFAULT_COUNTRIES = [
  { code: 'USA', name: 'United States', flag: '\u{1F1FA}\u{1F1F8}', regulatorCount: 4 },
  { code: 'UK', name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}', regulatorCount: 1 },
  { code: 'Canada', name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}', regulatorCount: 3 },
  { code: 'Australia', name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', regulatorCount: 1 },
  { code: 'UAE', name: 'UAE', flag: '\u{1F1E6}\u{1F1EA}', regulatorCount: 1 },
  { code: 'Germany', name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', regulatorCount: 1 },
];

export default function ModernMigrationPage() {
  const { token, user, setUser, setToken } = useUser();
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [countries, setCountries] = useState<Country[]>(DEFAULT_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [regulators, setRegulators] = useState<Regulator[]>([]);
  const [selectedRegulator, setSelectedRegulator] = useState<Regulator | null>(null);
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [trackedRegulators, setTrackedRegulators] = useState<string[]>([]);

  const [loadingRegulators, setLoadingRegulators] = useState(false);
  const [loadingPathways, setLoadingPathways] = useState(false);

  const [askModalOpen, setAskModalOpen] = useState(false);

  const fetchCountries = useCallback(async () => {
    try {
      const res = await fetch('/api/migration/countries');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setCountries(data);
        }
      }
    } catch (error) {
      console.log('Using default countries');
    }
  }, []);

  const fetchProgress = useCallback(async () => {
    const storedToken = token || localStorage.getItem('token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_BASE_URL + '/api/migration/progress', {
        headers: {
          'Authorization': 'Bearer ' + storedToken,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data);
        if (data.targetCountry) {
          setSelectedCountry(data.targetCountry);
          fetchRegulators(data.targetCountry);
        }
      }
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchUserTracking = useCallback(async () => {
    const storedToken = token || localStorage.getItem('token');
    if (!storedToken) return;

    try {
      const res = await fetch('/api/migration/track', {
        headers: { 'Authorization': `Bearer ${storedToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTrackedRegulators(data.map((r: Regulator) => r.id));
      }
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
    }
  }, [token]);

  useEffect(() => {
    setMounted(true);
    fetchCountries();
    fetchProgress();
    if (token) {
      fetchUserTracking();
    }
  }, [token, fetchCountries, fetchProgress, fetchUserTracking]);

  const fetchRegulators = async (country: string) => {
    setLoadingRegulators(true);
    try {
      const res = await fetch(`/api/migration/regulators?country=${country}`);
      if (res.ok) {
        const data = await res.json();
        setRegulators(data);
      }
    } catch (error) {
      console.error('Failed to fetch regulators:', error);
      setRegulators([]);
    } finally {
      setLoadingRegulators(false);
    }
  };

  const fetchPathways = async (regulatorId: string) => {
    setLoadingPathways(true);
    try {
      const res = await fetch(`/api/migration/pathways?regulatorId=${regulatorId}`);
      if (res.ok) {
        const data = await res.json();
        setPathways(data);
      }
    } catch (error) {
      console.error('Failed to fetch pathways:', error);
      setPathways([]);
    } finally {
      setLoadingPathways(false);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country.code);
    setSelectedRegulator(null);
    setPathways([]);
    fetchRegulators(country.code);
  };

  const handleRegulatorSelect = (regulator: Regulator) => {
    setSelectedRegulator(regulator);
    fetchPathways(regulator.id);
  };

  const handleTrackRegulator = async (regulatorId: string, action: 'track' | 'untrack') => {
    const storedToken = token || localStorage.getItem('token');
    if (!storedToken) return;

    try {
      const res = await fetch('/api/migration/track', {
        method: action === 'track' ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ regulatorId }),
      });

      if (res.ok) {
        if (action === 'track') {
          setTrackedRegulators([...trackedRegulators, regulatorId]);
        } else {
          setTrackedRegulators(trackedRegulators.filter(id => id !== regulatorId));
        }
      }
    } catch (error) {
      console.error('Failed to track regulator:', error);
    }
  };

  const updateProgress = async (field: string, value: unknown) => {
    const storedToken = token || localStorage.getItem('token');
    if (!storedToken || !progress) return;

    const prevProgress = { ...progress };
    setProgress({ ...prevProgress, [field]: value });
    setSaving(true);

    try {
      const res = await fetch(API_BASE_URL + '/api/migration/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + storedToken,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      } else {
        setProgress(prevProgress);
      }
    } catch (err) {
      console.error('Failed to update progress');
      setProgress(prevProgress);
    } finally {
      setSaving(false);
    }
  };

  const calculateReadiness = (data: MigrationProgress) => {
    let score = 0;
    const items = [
      data.nclexStatus,
      data.ieltsStatus,
      data.credentialEvalStatus,
      data.visaStatus,
    ];

    items.forEach(status => {
      if (status === 'COMPLETED') score += 25;
      else if (status === 'IN_PROGRESS') score += 10;
    });

    return Math.min(score, 100);
  };

  const getPathwayStep = (key: string) => {
    const pathway = pathways[0];
    if (!pathway) return null;

    const steps = JSON.parse(pathway.steps || '[]');
    return steps.find((s: string) => s.toLowerCase().includes(key.toLowerCase()));
  };

  if (!mounted || loading) {
    return <MigrationSkeleton />;
  }

  const readinessScore = progress ? calculateReadiness(progress) : 0;
  const currentCountry = countries.find(c => c.code === selectedCountry);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex justify-between items-start flex-wrap gap-5">
          <div>
            <h1 className="text-[28px] font-extrabold text-white mb-2 font-heading">
              Migration Tracker <Globe className="w-6 h-6 inline" />
            </h1>
            <p className="text-sm text-white/90 max-w-[400px]">
              Select your target country and regulator to track your journey to working abroad
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-white/80 mb-1">Readiness Score</div>
              <div className="text-4xl font-extrabold text-white">{readinessScore}%</div>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                <motion.circle
                  cx="20" cy="20" r="16"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - (readinessScore / 100) * 100 }}
                  transition={{ duration: 1 }}
                  style={{ strokeDasharray: 100 }}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${readinessScore}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {!token && !localStorage.getItem('token') ? (
        <div className="min-h-[40vh] flex items-center justify-center p-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md p-10 bg-card border border-border rounded-2xl"
          >
            <div className="text-6xl mb-5 flex justify-center">
              <Lock className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 font-heading">
              Login Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please log in to track your migration progress and connect with regulators.
            </p>
            <Link
              href="/login"
              className={buttonVariants({ variant: 'default', className: 'px-8 py-3.5 h-auto text-base' })}
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      ) : (
        <>
          <CountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            onSelect={handleCountrySelect}
          />

          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <RegulatorSelector
                regulators={regulators}
                selectedRegulator={selectedRegulator?.id || null}
                trackedRegulators={trackedRegulators}
                onSelect={handleRegulatorSelect}
                onTrack={handleTrackRegulator}
                loading={loadingRegulators}
              />
            </motion.div>
          )}

          {selectedRegulator && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-foreground font-heading">
                  Your Progress with {selectedRegulator.name}
                </h2>
                <Link
                  href={`/regulators/${selectedRegulator.slug}`}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
                <TrackerCard
                  title="Language Exam"
                  icon="📚"
                  gradient="linear-gradient(135deg, #EC4899, #F43F5E)"
                  status={progress?.ieltsStatus || 'NOT_STARTED'}
                  date={progress?.ieltsDate}
                  score={progress?.ieltsScore}
                  examName={pathways[0]?.englishTests ? `Required: ${JSON.parse(pathways[0].englishTests).join(' or ')}` : 'IELTS/OET'}
                  fees={pathways[0]?.fees}
                  documents={pathways[0]?.documents}
                  onStatusChange={(v) => updateProgress('ieltsStatus', v)}
                  onDateChange={(v) => updateProgress('ieltsDate', v)}
                  onScoreChange={(v) => updateProgress('ieltsScore', v)}
                  onAskRegulator={() => setAskModalOpen(true)}
                  statusOptions={statusOptions}
                  saving={saving}
                  scoreLabel="Band Score"
                  scoreStep={0.5}
                />

                <TrackerCard
                  title="Credential Evaluation"
                  icon="📋"
                  gradient="linear-gradient(135deg, #10B981, #059669)"
                  status={progress?.credentialEvalStatus || 'NOT_STARTED'}
                  date={progress?.credentialEvalDate}
                  onStatusChange={(v) => updateProgress('credentialEvalStatus', v)}
                  onDateChange={(v) => updateProgress('credentialEvalDate', v)}
                  onAskRegulator={() => setAskModalOpen(true)}
                  statusOptions={statusOptions}
                  saving={saving}
                />

                <TrackerCard
                  title="Professional Exam"
                  icon="📝"
                  gradient="linear-gradient(135deg, #6366F1, #8B5CF6)"
                  status={progress?.nclexStatus || 'NOT_STARTED'}
                  date={progress?.nclexDate}
                  score={progress?.nclexScore}
                  examName={pathways[0]?.examName || 'NCLEX-RN'}
                  fees={pathways[0]?.fees}
                  documents={pathways[0]?.documents}
                  onStatusChange={(v) => updateProgress('nclexStatus', v)}
                  onDateChange={(v) => updateProgress('nclexDate', v)}
                  onScoreChange={(v) => updateProgress('nclexScore', v)}
                  onAskRegulator={() => setAskModalOpen(true)}
                  statusOptions={statusOptions}
                  saving={saving}
                />

                <TrackerCard
                  title="Visa Application"
                  icon="🛂"
                  gradient="linear-gradient(135deg, #F59E0B, #D97706)"
                  status={progress?.visaStatus || 'NOT_STARTED'}
                  date={progress?.visaDate}
                  onStatusChange={(v) => updateProgress('visaStatus', v)}
                  onDateChange={(v) => updateProgress('visaDate', v)}
                  onAskRegulator={() => setAskModalOpen(true)}
                  statusOptions={statusOptions}
                  saving={saving}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base font-heading">Cost Estimation</h3>
                      <p className="text-xs text-muted-foreground mt-1">Track your expenses</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Estimated Total Cost (USD)
                    </label>
                    <Input
                      type="number"
                      value={progress?.costEstimate || ''}
                      onChange={(e) => updateProgress('costEstimate', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="e.g. 15000"
                    />
                  </div>

                  {pathways[0]?.timeline && (
                    <div className="p-4 bg-muted/50 border border-border rounded-xl">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        Estimated Timeline
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {pathways[0].timeline}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </>
      )}

      <AskRegulatorModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        regulatorId={selectedRegulator?.id || ''}
        regulatorName={selectedRegulator?.name || ''}
        hasLiveSessions={(selectedRegulator?._count.liveSessions || 0) > 0}
      />
    </motion.div>
  );
}

function MigrationSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl h-[200px]">
        <div className="bg-white/20 rounded-md h-8 w-3/5 mb-3" />
        <div className="bg-white/20 rounded-md h-5 w-2/5 mb-6" />
        <div className="bg-white/20 rounded-full h-2 w-full" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-muted rounded-2xl h-[280px]" />
        ))}
      </div>
    </div>
  );
}
