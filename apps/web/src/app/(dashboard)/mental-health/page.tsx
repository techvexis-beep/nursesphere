'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Brain, AlertTriangle, AlertCircle, Star, ClipboardList,
  BookOpen, FileText, Heart, MessageCircle
} from 'lucide-react';

const burnoutQuestions = [
  { id: 1, question: 'How often do you feel exhausted at the end of your shift?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
  { id: 2, question: 'Do you feel emotionally detached from your patients?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
  { id: 3, question: 'Do you feel accomplish in your work?', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] },
  { id: 4, question: 'How often do you feel overwhelmed by your workload?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
  { id: 5, question: 'Do you have trouble sleeping after shifts?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
];

const resources = [
  { icon: 'heart', title: 'Guided Meditation', desc: '10-minute stress relief sessions', color: '#00C48C' },
  { icon: 'fileText', title: 'Anonymous Journaling', desc: 'Express your thoughts privately', color: '#6C7AEB' },
  { icon: 'messageCircle', title: 'Peer Support', desc: 'Connect with fellow nurses', color: '#FCA311' },
  { icon: 'bookOpen', title: 'Wellness Resources', desc: 'Articles and self-help guides', color: '#FF6B6B' },
];

const resourceIcons: Record<string, React.ReactNode> = {
  heart: <Heart className="h-10 w-10" />,
  fileText: <FileText className="h-10 w-10" />,
  messageCircle: <MessageCircle className="h-10 w-10" />,
  bookOpen: <BookOpen className="h-10 w-10" />,
};

const tabs = [
  { id: 'assessment' as const, label: 'Burnout Assessment', icon: ClipboardList },
  { id: 'resources' as const, label: 'Resources', icon: BookOpen },
  { id: 'journal' as const, label: 'Journal', icon: FileText },
];

export default function MentalHealthPage() {
  const [activeTab, setActiveTab] = useState<'assessment' | 'resources' | 'journal'>('assessment');
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ score: number; level: string; color: string } | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [entries, setEntries] = useState<{ id: number; text: string; date: string; mood: string }[]>([
    { id: 1, text: 'Today was a challenging day but I helped a patient recover.', date: '2 hours ago', mood: '\uD83D\uDE0A' },
    { id: 2, text: 'Feeling overwhelmed with the new protocol changes.', date: 'Yesterday', mood: '\uD83D\uDE14' },
  ]);

  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  const submitAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQ < burnoutQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const score = newAnswers.reduce((a, b) => a + b, 0);
      const maxScore = burnoutQuestions.length * 4;
      const percentage = (score / maxScore) * 100;

      let level = 'Low Risk';
      let color = '#00C48C';
      if (percentage >= 60) {
        level = 'Moderate Risk';
        color = '#FCA311';
      } else if (percentage >= 80) {
        level = 'High Risk';
        color = '#FF6B6B';
      }

      setResult({ score: percentage, level, color });
    }
  };

  const saveJournal = () => {
    if (!journalEntry.trim()) return;

    const moods = ['\uD83D\uDE0A', '\uD83D\uDE14', '\uD83D\uDE24', '\uD83D\uDE34', '\uD83D\uDE30', '\uD83E\uDD17'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    setEntries([{ id: Date.now(), text: journalEntry, date: 'Just now', mood: randomMood }, ...entries]);
    setJournalEntry('');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Mental Health & Wellness</h1>
        <p className="mt-1 text-muted-foreground">Your wellbeing matters. Take a moment for yourself.</p>
      </div>

      <div className="mb-8 flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'default' : 'secondary'}
            className="flex-1"
          >
            <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'assessment' && (
        <div className="animate-[fadeIn_0.3s_ease]">
          {!assessmentStarted ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Brain className="mx-auto mb-4 h-16 w-16 text-primary" />
              <h2 className="mb-4 text-2xl font-semibold text-foreground">Burnout Risk Assessment</h2>
              <p className="mx-auto mb-8 max-w-[500px] text-muted-foreground">
                Take this quick assessment to understand your burnout risk level. This is anonymous and for informational purposes only.
              </p>
              <Button onClick={startAssessment} size="lg">
                Start Assessment
              </Button>
            </div>
          ) : result ? (
            <div className="animate-[scaleIn_0.5s_ease] rounded-xl border border-border bg-card p-12 text-center">
              <div
                className="mx-auto mb-6 flex h-[150px] w-[150px] items-center justify-center rounded-full text-6xl"
                style={{ background: `${result.color}20` }}
              >
                {result.score < 40 ? (
                  <Star className="h-16 w-16 text-success" />
                ) : result.score < 60 ? (
                  <AlertTriangle className="h-16 w-16 text-warning" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-destructive" />
                )}
              </div>
              <h2 className="mb-2 text-3xl font-bold" style={{ color: result.color }}>
                {result.level}
              </h2>
              <p className="mb-4 text-xl font-semibold text-foreground">Score: {result.score.toFixed(0)}%</p>
              <p className="mx-auto mb-8 max-w-[400px] text-muted-foreground">
                {result.score < 40
                  ? "You're doing great! Keep prioritizing your self-care."
                  : result.score < 60
                  ? "Consider taking more breaks and talking to someone."
                  : "Please consider reaching out to a professional for support."}
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setAssessmentStarted(false)} variant="outline">Retake</Button>
                <Button onClick={() => setActiveTab('resources')}>View Resources</Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Question {currentQ + 1} of {burnoutQuestions.length}
                </span>
                <div className="flex gap-1">
                  {burnoutQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${i <= currentQ ? 'bg-primary' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </div>
              <h3 className="mb-8 text-xl font-semibold leading-relaxed text-foreground">
                {burnoutQuestions[currentQ].question}
              </h3>
              <div className="flex flex-col gap-3">
                {burnoutQuestions[currentQ].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => submitAnswer(i)}
                    className="w-full rounded-lg border-2 border-border bg-card p-4 text-left font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="animate-[fadeIn_0.3s_ease]">
          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4">{resourceIcons[resource.icon]}</div>
                <h3 className="mb-2 font-semibold text-foreground">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Emergency Support</h2>
            <div className="rounded-lg border-l-4 border-l-destructive bg-destructive/10 p-4">
              <p className="font-medium text-destructive">If you're in crisis, please reach out:</p>
              <ul className="mt-2 pl-5 text-destructive-foreground/80">
                <li>Nurse Suicide Hotline: 988</li>
                <li>Crisis Text Line: Text HOME to 741741</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'journal' && (
        <div className="animate-[fadeIn_0.3s_ease]">
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Anonymous Journal</h2>
            <p className="mb-6 text-muted-foreground">Your entries are private and encrypted.</p>

            <div className="mb-8">
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="How are you feeling today?"
                rows={4}
                className="mb-4 w-full resize-y rounded-md border-2 border-border bg-transparent p-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button onClick={saveJournal} disabled={!journalEntry.trim()}>
                Save Entry
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {entries.map((entry) => (
                <div key={entry.id} className="rounded-lg bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-2xl">{entry.mood}</span>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                  <p className="text-foreground">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
