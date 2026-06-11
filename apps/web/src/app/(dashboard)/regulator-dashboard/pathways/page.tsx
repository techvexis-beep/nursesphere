'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  BarChart3, Megaphone, ClipboardList, HelpCircle, Video,
  TrendingUp, Settings, FileEdit, MessageSquare, Timer, X,
  Plus
} from 'lucide-react';

interface Pathway {
  id: string;
  country: string;
  pathwayType: string;
  title: string;
  description: string;
  examRequired: boolean;
  examName: string | null;
  englishRequired: boolean;
  timeline: string | null;
  isActive: boolean;
}

const samplePathways: Pathway[] = [
  {
    id: '1',
    country: 'USA',
    pathwayType: 'RN',
    title: 'NCLEX-RN for International Nurses',
    description: 'Complete licensing pathway for internationally educated nurses to practice as Registered Nurses in the United States.',
    examRequired: true,
    examName: 'NCLEX-RN',
    englishRequired: true,
    timeline: '6-12 months',
    isActive: true,
  },
  {
    id: '2',
    country: 'UK',
    pathwayType: 'RN',
    title: 'NMC Registration for International Nurses',
    description: 'Pathway for internationally educated nurses to register with the Nursing and Midwifery Council in the UK.',
    examRequired: true,
    examName: 'CBT + OSCE',
    englishRequired: true,
    timeline: '6-9 months',
    isActive: true,
  },
  {
    id: '3',
    country: 'Australia',
    pathwayType: 'RN',
    title: 'AHPRA Nursing Registration',
    description: 'Process for internationally educated nurses to obtain registration with AHPRA to practice in Australia.',
    examRequired: false,
    examName: null,
    englishRequired: true,
    timeline: '3-6 months',
    isActive: true,
  },
];

const countries = ['USA', 'UK', 'Canada', 'Australia', 'Ireland', 'UAE', 'Saudi Arabia', 'Germany', 'Singapore', 'Philippines'];
const pathwayTypes = ['RN', 'LPN', 'EN', 'SPECIALTY'];

const navItems = [
  { icon: BarChart3, label: 'Overview', href: '/regulator-dashboard' },
  { icon: Megaphone, label: 'Announcements', href: '/regulator-dashboard/announcements' },
  { icon: ClipboardList, label: 'Pathways', href: '/regulator-dashboard/pathways', active: true },
  { icon: HelpCircle, label: 'FAQs', href: '/regulator-dashboard/faqs' },
  { icon: Video, label: 'Live Sessions', href: '/regulator-dashboard/live' },
  { icon: TrendingUp, label: 'Analytics', href: '/regulator-dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/regulator-dashboard/settings' },
];

export default function PathwaysPage() {
  const [pathways, setPathways] = useState<Pathway[]>(samplePathways);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    country: 'USA',
    pathwayType: 'RN',
    title: '',
    description: '',
    examRequired: false,
    examName: '',
    englishRequired: true,
    timeline: '',
  });

  const handleSubmit = () => {
    if (editingId) {
      setPathways(pathways.map(p => p.id === editingId ? { ...p, ...formData, examName: formData.examRequired ? formData.examName : null } : p));
    } else {
      setPathways([{
        id: Date.now().toString(),
        ...formData,
        examName: formData.examRequired ? formData.examName : null,
        isActive: true,
      }, ...pathways]);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ country: 'USA', pathwayType: 'RN', title: '', description: '', examRequired: false, examName: '', englishRequired: true, timeline: '' });
  };

  const handleEdit = (pathway: Pathway) => {
    setFormData({
      country: pathway.country,
      pathwayType: pathway.pathwayType,
      title: pathway.title,
      description: pathway.description,
      examRequired: pathway.examRequired,
      examName: pathway.examName || '',
      englishRequired: pathway.englishRequired,
      timeline: pathway.timeline || '',
    });
    setEditingId(pathway.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setPathways(pathways.filter(p => p.id !== id));
  };

  const toggleActive = (id: string) => {
    setPathways(pathways.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        .glass-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); }
      `}</style>

      <div className="flex">
        <div className="w-[280px] min-h-screen bg-black/30 border-r border-border/10 p-6 pr-4 fixed left-0 top-0">
          <Link href="/regulator-dashboard" className="flex items-center gap-3 no-underline mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-500 rounded-xl flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-lg text-foreground">Regulator</span>
          </Link>
          
          <nav className="flex flex-col gap-1">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link key={i} href={item.href} className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl no-underline transition-all',
                  item.active
                    ? 'text-primary bg-primary/15 border border-primary/30'
                    : 'text-muted-foreground border border-transparent hover:bg-secondary'
                )}>
                  <div className="flex items-center gap-3">
                    <Icon className="h-[18px] w-[18px]" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 ml-[280px] p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-[32px] font-bold mb-2">Licensing Pathways</h1>
              <p className="text-muted-foreground">Manage licensing pathways for international nurses</p>
            </div>
            <Button onClick={() => setShowModal(true)} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Add Pathway
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {pathways.map((pathway, index) => (
              <motion.div
                key={pathway.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border/10 rounded-2xl p-6 backdrop-blur-xl"
                style={{ opacity: pathway.isActive ? 1 : 0.6 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 bg-primary/20 rounded-md text-xs text-primary font-semibold">{pathway.pathwayType}</span>
                      <span className="text-muted-foreground text-sm">{pathway.country}</span>
                      {pathway.examRequired && <span className="px-2.5 py-1 bg-amber-500/20 rounded-md text-[11px] text-amber-500 flex items-center gap-1"><FileEdit className="h-3 w-3" /> {pathway.examName}</span>}
                      {pathway.englishRequired && <span className="px-2.5 py-1 bg-pink-500/20 rounded-md text-[11px] text-pink-500 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> English</span>}
                      {pathway.timeline && <span className="px-2.5 py-1 bg-green-500/20 rounded-md text-[11px] text-green-500 flex items-center gap-1"><Timer className="h-3 w-3" /> {pathway.timeline}</span>}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{pathway.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{pathway.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(pathway)}>Edit</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(pathway.id)}
                      className={cn(
                        'border',
                        pathway.isActive
                          ? 'text-red-500 border-red-500/20 bg-red-500/10'
                          : 'text-green-500 border-green-500/20 bg-green-500/10'
                      )}
                    >
                      {pathway.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(pathway.id)} className="text-red-500 border border-red-500/20 bg-red-500/10">Delete</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]">
          <div className="bg-card border border-border/10 backdrop-blur-xl w-[600px] p-8 rounded-[20px] mx-4">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Pathway' : 'Add New Pathway'}</h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="flex-1 py-3.5 px-4 bg-card border border-border/50 rounded-xl text-foreground text-[15px]">
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={formData.pathwayType} onChange={(e) => setFormData({ ...formData, pathwayType: e.target.value })} className="flex-1 py-3.5 px-4 bg-card border border-border/50 rounded-xl text-foreground text-[15px]">
                  {pathwayTypes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <Input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="py-3.5 h-auto bg-card border-border/50 text-foreground text-[15px] rounded-xl" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="py-3.5 px-4 bg-card border border-border/50 rounded-xl text-foreground text-[15px] resize-none" />
              <Input type="text" placeholder="Timeline (e.g., 6-12 months)" value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} className="py-3.5 h-auto bg-card border-border/50 text-foreground text-[15px] rounded-xl" />
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.examRequired} onChange={(e) => setFormData({ ...formData, examRequired: e.target.checked })} className="accent-primary" />
                  <span>Exam Required</span>
                </label>
                {formData.examRequired && (
                  <Input type="text" placeholder="Exam Name" value={formData.examName} onChange={(e) => setFormData({ ...formData, examName: e.target.value })} className="flex-1 py-2 h-auto bg-card border-border/50 text-foreground text-sm rounded-lg" />
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.englishRequired} onChange={(e) => setFormData({ ...formData, englishRequired: e.target.checked })} className="accent-primary" />
                  <span>English Required</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={() => { setShowModal(false); setEditingId(null); }} variant="secondary" className="flex-1">Cancel</Button>
              <Button onClick={handleSubmit} variant="default" className="flex-1">{editingId ? 'Save' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
