'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  LayoutDashboard, Megaphone, ClipboardList, HelpCircle, 
  TrendingUp, Settings, Pin, Plus, Pencil, Trash2, Check, X
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  isPinned: boolean;
  publishedAt: string;
  status: 'published' | 'draft';
}

const sampleAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'NCLEX-RN Passing Standard Update 2025',
    content: 'The NCSBN Board of Directors has approved a new passing standard for the NCLEX-RN examination, effective April 1, 2025.',
    category: 'EXAM',
    priority: 'HIGH',
    isPinned: true,
    publishedAt: '2026-03-15',
    status: 'published',
  },
  {
    id: '2',
    title: 'New NCLEX-RN Test Plan Implementation',
    content: 'A new NCLEX-RN test plan will be implemented on April 1, 2025, introducing updated content areas.',
    category: 'EXAM',
    priority: 'NORMAL',
    isPinned: false,
    publishedAt: '2026-03-10',
    status: 'published',
  },
  {
    id: '3',
    title: 'Credential Evaluation Process Update',
    content: 'Updated guidelines for CGFNS credential evaluation for international nurses.',
    category: 'LICENSING',
    priority: 'NORMAL',
    isPinned: false,
    publishedAt: '2026-03-05',
    status: 'draft',
  },
];

const categories = ['LICENSING', 'EXAM', 'POLICY', 'EMERGENCY'];
const priorities = ['NORMAL', 'HIGH', 'URGENT'];

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/regulator-dashboard' },
  { icon: Megaphone, label: 'Announcements', href: '/regulator-dashboard/announcements', active: true, badge: '3' },
  { icon: ClipboardList, label: 'Pathways', href: '/regulator-dashboard/pathways' },
  { icon: HelpCircle, label: 'FAQs', href: '/regulator-dashboard/faqs' },
  { icon: TrendingUp, label: 'Analytics', href: '/regulator-dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/regulator-dashboard/settings' },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'LICENSING',
    priority: 'NORMAL',
    isPinned: false,
    status: 'draft' as 'published' | 'draft',
  });

  const handleSubmit = () => {
    if (editingId) {
      setAnnouncements(announcements.map(a => 
        a.id === editingId ? { ...a, ...formData } : a
      ));
    } else {
      setAnnouncements([{
        id: Date.now().toString(),
        ...formData,
        publishedAt: new Date().toISOString().split('T')[0],
      }, ...announcements]);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', content: '', category: 'LICENSING', priority: 'NORMAL', isPinned: false, status: 'draft' });
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData(announcement);
    setEditingId(announcement.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const togglePublish = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, status: a.status === 'published' ? 'draft' : 'published' } : a
    ));
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'EXAM': return { bg: 'bg-pink-500/20', text: 'text-pink-400' };
      case 'LICENSING': return { bg: 'bg-indigo-500/20', text: 'text-indigo-400' };
      default: return { bg: 'bg-amber-500/20', text: 'text-amber-400' };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 xl:w-72 min-h-screen bg-black/30 border-r border-border p-6 lg:fixed lg:left-0 lg:top-0">
          <Link href="/regulator-dashboard" className="flex items-center gap-3 no-underline mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-lg text-foreground">Regulator</span>
          </Link>
          
          <nav className="flex flex-col gap-1">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl no-underline transition-all ${
                    item.active 
                      ? 'bg-primary/15 text-primary border border-primary/30' 
                      : 'text-muted-foreground hover:bg-muted border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-primary/20 rounded-lg text-xs">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 xl:ml-72 p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Announcements</h1>
              <p className="text-muted-foreground">Manage official announcements and updates</p>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus size={18} className="mr-2" />
              New Announcement
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {announcements.map((announcement, index) => {
              const catColor = getCategoryColor(announcement.category);
              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {announcement.isPinned && <Pin size={14} className="text-amber-400" />}
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${catColor.bg} ${catColor.text}`}>
                          {announcement.category}
                        </span>
                        {announcement.priority === 'HIGH' && (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-destructive/20 text-destructive">HIGH</span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          announcement.status === 'published' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {announcement.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{announcement.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground/70">Published: {announcement.publishedAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(announcement)}>
                        <Pencil size={14} className="mr-1.5" />
                        Edit
                      </Button>
                      <Button variant={announcement.status === 'published' ? 'destructive' : 'secondary'} size="sm" onClick={() => togglePublish(announcement.id)}>
                        {announcement.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(announcement.id)}>
                        <Trash2 size={14} className="mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg p-8 rounded-2xl bg-card border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editingId ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="py-3.5 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
              <textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                className="w-full py-3.5 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 resize-none outline-none focus:border-primary/50 transition-colors"
              />
              <div className="flex gap-3">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-muted border border-border text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-muted border border-border text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-4 h-4 rounded border-border bg-muted"
                />
                <span className="text-muted-foreground text-sm">Pin this announcement</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                  className="w-4 h-4 rounded border-border bg-muted"
                />
                <span className="text-muted-foreground text-sm">Publish immediately</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" className="flex-1" onClick={() => { setShowModal(false); setEditingId(null); }}>
                Cancel
              </Button>
              <Button variant="default" className="flex-1" onClick={handleSubmit}>
                {editingId ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
