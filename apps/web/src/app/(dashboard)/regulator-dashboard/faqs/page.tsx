'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, Megaphone, ClipboardList, HelpCircle, Circle, TrendingUp, Settings, ThumbsUp, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  upvotes: number;
  isPublished: boolean;
}

const sampleFAQs: FAQ[] = [
  { id: '1', question: 'How do I apply to take the NCLEX-RN exam?', answer: 'To apply for the NCLEX-RN, you must first submit an application to the nursing regulatory body (NRB) in the state/territory where you wish to be licensed.', category: 'EXAM', upvotes: 156, isPublished: true },
  { id: '2', question: 'What is the passing score for NCLEX-RN?', answer: 'The NCLEX-RN uses a computerized adaptive testing (CAT) format and does not have a fixed passing score.', category: 'EXAM', upvotes: 98, isPublished: true },
  { id: '3', question: 'How long is my NMC registration valid?', answer: 'NMC registration is valid for one year and must be renewed annually.', category: 'LICENSING', upvotes: 87, isPublished: true },
  { id: '4', question: 'What English tests does AHPRA accept?', answer: 'AHPRA accepts IELTS Academic, OET, PTE Academic, or proof of completion of five years of secondary and/or tertiary education in English.', category: 'LICENSING', upvotes: 76, isPublished: true },
  { id: '5', question: 'How many times can I take the NCLEX-RN?', answer: 'Candidates can take the NCLEX-RN up to 8 times per year, with a minimum 45-day waiting period between attempts.', category: 'EXAM', upvotes: 65, isPublished: false },
];

const categories = ['EXAM', 'LICENSING', 'POLICY', 'RENEWAL'];

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/regulator-dashboard' },
  { icon: Megaphone, label: 'Announcements', href: '/regulator-dashboard/announcements' },
  { icon: ClipboardList, label: 'Pathways', href: '/regulator-dashboard/pathways' },
  { icon: HelpCircle, label: 'FAQs', href: '/regulator-dashboard/faqs', active: true },
  { icon: Circle, label: 'Live Sessions', href: '/regulator-dashboard/live' },
  { icon: TrendingUp, label: 'Analytics', href: '/regulator-dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/regulator-dashboard/settings' },
];

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(sampleFAQs);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'EXAM', isPublished: true });

  const handleSubmit = () => {
    if (editingId) {
      setFaqs(faqs.map(f => f.id === editingId ? { ...f, ...formData } : f));
    } else {
      setFaqs([{ id: Date.now().toString(), ...formData, upvotes: 0 }, ...faqs]);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ question: '', answer: '', category: 'EXAM', isPublished: true });
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({ question: faq.question, answer: faq.answer, category: faq.category, isPublished: faq.isPublished });
    setEditingId(faq.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => setFaqs(faqs.filter(f => f.id !== id));
  const togglePublish = (id: string) => setFaqs(faqs.map(f => f.id === id ? { ...f, isPublished: !f.isPublished } : f));
  const handleUpvote = (id: string) => setFaqs(faqs.map(f => f.id === id ? { ...f, upvotes: f.upvotes + 1 } : f));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <div className="hidden lg:block w-[280px] min-h-screen bg-muted border-r border-border/50 p-6 fixed left-0 top-0">
          <Link href="/regulator-dashboard" className="flex items-center gap-3 no-underline mb-8 px-2">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-lg text-foreground">Regulator</span>
          </Link>
          <nav className="flex flex-col gap-1">
            {navItems.map((item, i) => (
              <Link key={i} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-[12px] no-underline text-sm font-medium ${item.active ? 'text-primary bg-primary/15 border border-primary/30' : 'text-muted-foreground bg-transparent border border-transparent'}`}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-1 lg:ml-[280px] p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">FAQs</h1>
              <p className="text-muted-foreground">Manage frequently asked questions</p>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add FAQ
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <motion.div key={faq.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`bg-card border border-border/50 p-6 rounded-[16px] ${faq.isPublished ? '' : 'opacity-60'}`}>
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-[10px] py-[4px] bg-emerald-500/20 rounded-[6px] text-xs font-semibold text-emerald-500">{faq.category}</span>
                      <span className={`px-[10px] py-[4px] rounded-[6px] text-xs ${faq.isPublished ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-500/20 text-muted-foreground'}`}>{faq.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
                    <h3 className="text-base font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleUpvote(faq.id)} className="gap-1.5">
                      <ThumbsUp className="h-4 w-4" /> {faq.upvotes}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(faq.id)} className={faq.isPublished ? 'text-red-500' : 'text-emerald-500'}>
                      {faq.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(faq.id)} className="text-red-500">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4">
          <div className="w-full max-w-[600px] bg-card border border-border/50 p-8 rounded-[20px]">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h2>
            <div className="flex flex-col gap-4">
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3.5 bg-muted border border-border rounded-[12px] text-foreground text-[15px]">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input
                type="text"
                placeholder="Question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
              <textarea
                placeholder="Answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={5}
                className="w-full p-3.5 bg-muted border border-border rounded-[12px] text-foreground text-[15px] resize-none font-sans"
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-4 h-4" />
                <span className="text-muted-foreground">Publish immediately</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => { setShowModal(false); setEditingId(null); }} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                {editingId ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
