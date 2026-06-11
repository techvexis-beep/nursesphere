'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Radio, Calendar, Clock, Landmark, MessageSquare,
  Timer, Bell, Video, Loader2, CalendarDays,
} from 'lucide-react';

interface LiveSession {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  duration: number;
  status: string;
  regulator: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  _count: {
    questions: number;
  };
}

const upcomingSessions: LiveSession[] = [
  {
    id: 'demo-1',
    title: 'NCLEX 2025 Updates: What You Need to Know',
    description: 'Join us for an exclusive session with NCSBN officials discussing the new NCLEX-RN test plan changes and passing standards for 2025.',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    status: 'SCHEDULED',
    regulator: {
      id: 'ncsbn',
      name: 'National Council of State Boards of Nursing (NCSBN)',
      slug: 'ncsbn',
      logo: null,
    },
    _count: { questions: 45 },
  },
  {
    id: 'demo-2',
    title: 'UK Nursing Registration: NMC Process Explained',
    description: 'Learn about the updated CBT and OSCE requirements for UK nursing registration from NMC representatives.',
    scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    status: 'SCHEDULED',
    regulator: {
      id: 'nmc',
      name: 'Nursing and Midwifery Council (NMC)',
      slug: 'nmc-uk',
      logo: null,
    },
    _count: { questions: 32 },
  },
  {
    id: 'demo-3',
    title: 'Australia AHPRA Registration Q&A',
    description: 'Direct Q&A with AHPRA representatives about the streamlined registration process for internationally educated nurses.',
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    status: 'SCHEDULED',
    regulator: {
      id: 'ahpra',
      name: 'Australian Health Practitioner Regulation Agency',
      slug: 'ahpra',
      logo: null,
    },
    _count: { questions: 28 },
  },
];

export default function LiveQAPage() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live'>('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live-qa/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.length > 0 ? data : upcomingSessions);
      } else {
        setSessions(upcomingSessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setSessions(upcomingSessions);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'live') return session.status === 'LIVE';
    if (filter === 'upcoming') return session.status === 'SCHEDULED' && new Date(session.scheduledAt) > new Date();
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diff = target.getTime() - now.getTime();

    if (diff < 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-500/10 to-transparent pt-32 pb-16 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-400 px-5 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Radio className="w-4 h-4 mr-2" />
            Live Q&A Sessions
          </Badge>
          <h1 className="text-5xl font-bold mb-4 font-heading">
            Live Sessions with{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Nursing Regulators
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join live question and answer sessions with official representatives from nursing boards worldwide. Get your licensing questions answered in real-time.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="px-8 max-w-6xl mx-auto mb-10">
        <div className="flex gap-3 justify-center">
          {(['all', 'upcoming', 'live'] as const).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant="outline"
              className={cn(
                'capitalize',
                filter === f && 'border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-400'
              )}
            >
              {f === 'all' && <CalendarDays className="w-4 h-4 mr-1.5" />}
              {f === 'upcoming' && <Clock className="w-4 h-4 mr-1.5" />}
              {f === 'live' && <Radio className="w-4 h-4 mr-1.5" />}
              {f === 'all' ? 'All Sessions' : f === 'upcoming' ? 'Upcoming' : 'Live Now'}
            </Button>
          ))}
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="px-8 pb-32 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-2 font-heading">No sessions found</h3>
            <p className="text-muted-foreground">Check back later for upcoming live Q&A sessions</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="rounded-2xl border border-border bg-card text-card-foreground shadow p-7 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30">
                  {/* Status + Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {session.status === 'LIVE' && (
                        <Badge variant="outline" className="border-red-500/20 bg-red-500/20 text-red-500 rounded-lg px-3 py-1 text-xs font-semibold gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          LIVE NOW
                        </Badge>
                      )}
                      {session.status === 'SCHEDULED' && (
                        <Badge variant="secondary" className="rounded-lg">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeUntil(session.scheduledAt)}
                        </Badge>
                      )}
                      {session.status === 'ENDED' && (
                        <Badge variant="outline" className="rounded-lg">Ended</Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground text-sm flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      {session.duration} min
                    </span>
                  </div>

                  {/* Regulator */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center overflow-hidden">
                      {session.regulator.logo ? (
                        <Image src={session.regulator.logo} alt={session.regulator.name} width={24} height={24} />
                      ) : (
                        <Landmark className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>
                    <span className="text-muted-foreground text-sm">{session.regulator.name}</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold mb-3 leading-snug font-heading">
                    {session.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                    {session.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(session.scheduledAt)}
                    </span>
                    <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {session._count.questions} questions
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/live/${session.id}`}
                    className={cn(
                      buttonVariants({
                        variant: session.status === 'LIVE' ? 'destructive' : 'secondary',
                      }),
                      'w-full mt-4'
                    )}
                  >
                    {session.status === 'LIVE' ? (
                      <><Radio className="w-4 h-4 mr-1.5" />Join Now</>
                    ) : session.status === 'SCHEDULED' ? (
                      <><Bell className="w-4 h-4 mr-1.5" />Set Reminder</>
                    ) : (
                      <><Video className="w-4 h-4 mr-1.5" />Watch Recording</>
                    )}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
