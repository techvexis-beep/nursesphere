'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Calendar, Clock, Users, HelpCircle, Circle } from 'lucide-react';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface AMASession {
  id: string;
  title: string;
  description: string;
  hospitalName: string | null;
  scheduledAt: string;
  duration: number;
  status: string;
  attendeesCount: number;
  questionsCount: number;
  recruiter: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

export default function AMAPage() {
  const { user, token } = useUser();
  const [sessions, setSessions] = useState<AMASession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', description: '', hospitalName: '', scheduledAt: '' });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch(API_BASE_URL + '/api/ama/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!token || !newSession.title.trim()) return;
    try {
      const res = await fetch(API_BASE_URL + '/api/ama/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSession),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewSession({ title: '', description: '', hospitalName: '', scheduledAt: '' });
        fetchSessions();
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return '#EF4444';
      case 'SCHEDULED': return '#10B981';
      case 'ENDED': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-3xl p-8"
          style={{
            background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #E11D48 100%)',
          }}
        >
          <div className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            }}
          />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-extrabold text-white">
                <Mic className="mr-2 inline-block" /> Recruiter AMAs
              </h1>
              <p className="max-w-[500px] text-white/90">
                Ask hospital recruiters your burning questions about jobs, interviews, and hiring processes
              </p>
            </div>
            {user && (
              <Button onClick={() => setShowCreate(true)} variant="secondary">
                + Host AMA
              </Button>
            )}
          </div>
        </motion.div>

        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-border bg-card p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Host a New AMA Session
            </h3>
            <div className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="Session title..."
                value={newSession.title}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              />
              <textarea
                placeholder="Description..."
                value={newSession.description}
                onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Input
                type="text"
                placeholder="Hospital name (optional)..."
                value={newSession.hospitalName}
                onChange={(e) => setNewSession({ ...newSession, hospitalName: e.target.value })}
              />
              <Input
                type="datetime-local"
                value={newSession.scheduledAt}
                onChange={(e) => setNewSession({ ...newSession, scheduledAt: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowCreate(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleCreate} variant="default">
                  Create Session
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Upcoming Sessions
        </h2>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[180px] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl font-semibold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #EC4899, #F43F5E)',
                      }}
                    >
                      {session.recruiter.firstName[0]}{session.recruiter.lastName[0]}
                    </div>
                    <div>
                      <h3 className="m-0 text-lg font-semibold text-foreground">
                        {session.title}
                      </h3>
                      <p className="m-0 mt-1 text-xs text-muted-foreground/70">
                        {session.recruiter.firstName} {session.recruiter.lastName}
                        {session.hospitalName && ` \u2022 ${session.hospitalName}`}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: getStatusColor(session.status) + '20',
                      color: getStatusColor(session.status),
                    }}
                  >
                    {session.status === 'LIVE' ? <><Circle className="mr-1 inline-block h-2 w-2 fill-current" /> LIVE NOW</> : session.status}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {session.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-xs text-muted-foreground/60">
                    <span><Calendar className="mr-1 inline-block h-3 w-3" /> {formatDate(session.scheduledAt)}</span>
                    <span><Clock className="mr-1 inline-block h-3 w-3" /> {session.duration} min</span>
                    <span><Users className="mr-1 inline-block h-3 w-3" /> {session.attendeesCount} attending</span>
                    <span><HelpCircle className="mr-1 inline-block h-3 w-3" /> {session.questionsCount} questions</span>
                  </div>
                  <Button variant={session.status === 'LIVE' ? 'destructive' : 'default'}>
                    {session.status === 'LIVE' ? 'Join Now' : 'Register'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground/60">
            <div className="mb-4">
              <Mic className="mx-auto h-16 w-16" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-foreground">
              No upcoming AMAs
            </h3>
            <p>Check back later or host your own AMA!</p>
          </div>
        )}
      </div>
    </div>
  );
}
