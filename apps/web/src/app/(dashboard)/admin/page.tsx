'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Shield, FileCheck, Settings, BarChart3, Bell, Flag,
  Globe, Award, CheckCircle, XCircle, Clock, Search, Filter,
  ChevronDown, ChevronRight, Edit, Trash2, Eye, Mail,
  TrendingUp, TrendingDown, Activity, AlertTriangle, Database,
  Layers, Palette, Zap, Lock, Plus, Download, Upload, Crown, Sparkles,
  Rocket, Target, Heart, Star, Send, MessageSquare, UserPlus,
  X, Save, User, FileText, Check, AlertCircle, Loader2,
  Ban, Unlock, Trash, Edit2, Phone, MapPin, Calendar,
  Building, CreditCard, Briefcase
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CREATOR_USER } from '@/context/UserContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  verified: boolean;
  country: string;
  joinedAt: string;
  lastActive: string;
  phone?: string;
  bio?: string;
}

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  documents: { name: string; url: string }[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
  targetAudience: string;
}

interface Message {
  id: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  sentAt: string;
  type: 'welcome' | 'custom' | 'announcement' | 'verification';
  status: 'sent' | 'delivered' | 'read';
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  category: string;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  timestamp: string;
  details: string;
}

interface HospitalClient {
  id: string;
  name: string;
  email: string;
  hospitalName: string;
  licenseTier: 'basic' | 'professional' | 'enterprise';
  jobPostingsUsed: number;
  jobPostingsLimit: number;
  nurseAccessUsed: number;
  nurseAccessLimit: number;
  status: 'active' | 'suspended';
  subscribedAt: string;
  expiresAt: string;
  mrr: number;
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // User Management States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<User | null>(null);

  // Message States
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<User | null>(null);
  const [messageType, setMessageType] = useState<'welcome' | 'custom'>('custom');
  const [messageContent, setMessageContent] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');

  // Announcement States
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    targetAudience: 'All Users',
    status: 'draft' as 'active' | 'draft' | 'archived'
  });

  // Verification States
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Hospital Management States
  const [hospitals, setHospitals] = useState<HospitalClient[]>([
    { id: '1', name: 'John Smith', email: 'john@medicore.com', hospitalName: 'Medicore General Hospital', licenseTier: 'enterprise', jobPostingsUsed: 8, jobPostingsLimit: -1, nurseAccessUsed: 156, nurseAccessLimit: -1, status: 'active', subscribedAt: '2024-01-15', expiresAt: '2025-01-15', mrr: 1499 },
    { id: '2', name: 'Lisa Chen', email: 'lisa@cityhealth.org', hospitalName: 'City Health Medical Center', licenseTier: 'professional', jobPostingsUsed: 12, jobPostingsLimit: 20, nurseAccessUsed: 89, nurseAccessLimit: 200, status: 'active', subscribedAt: '2024-02-01', expiresAt: '2025-02-01', mrr: 599 },
    { id: '3', name: 'Michael Brown', email: 'michael@stlukes.com', hospitalName: "St. Luke's Hospital", licenseTier: 'basic', jobPostingsUsed: 3, jobPostingsLimit: 5, nurseAccessUsed: 23, nurseAccessLimit: 50, status: 'active', subscribedAt: '2024-02-15', expiresAt: '2025-02-15', mrr: 299 },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@regionalmed.com', hospitalName: 'Regional Medical Center', licenseTier: 'professional', jobPostingsUsed: 18, jobPostingsLimit: 20, nurseAccessUsed: 178, nurseAccessLimit: 200, status: 'active', subscribedAt: '2024-01-20', expiresAt: '2025-01-20', mrr: 599 },
    { id: '5', name: 'David Lee', email: 'david@globalcare.net', hospitalName: 'Global Care Network', licenseTier: 'enterprise', jobPostingsUsed: 15, jobPostingsLimit: -1, nurseAccessUsed: 234, nurseAccessLimit: -1, status: 'suspended', subscribedAt: '2024-01-10', expiresAt: '2025-01-10', mrr: 1499 },
  ]);
  const [selectedHospital, setSelectedHospital] = useState<HospitalClient | null>(null);

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'LICENSED_NURSE', status: 'active', verified: true, country: 'Nigeria', joinedAt: '2024-01-15', lastActive: '2 hours ago', phone: '+2348012345678' },
    { id: '2', name: 'Maria Garcia', email: 'maria@example.com', role: 'NURSE_STUDENT', status: 'active', verified: true, country: 'Philippines', joinedAt: '2024-02-20', lastActive: '5 hours ago', phone: '+639171234567' },
    { id: '3', name: 'James Wilson', email: 'james@example.com', role: 'MIGRATING_NURSE', status: 'pending', verified: false, country: 'India', joinedAt: '2024-03-10', lastActive: '1 day ago' },
    { id: '4', name: 'NCSBN Admin', email: 'admin@ncbsn.org', role: 'REGULATORY_BODY', status: 'active', verified: true, country: 'USA', joinedAt: '2023-06-01', lastActive: '1 hour ago' },
    { id: '5', name: 'Amara Okafor', email: 'amara@example.com', role: 'NURSE_ADVOCATE', status: 'active', verified: true, country: 'Ghana', joinedAt: '2024-01-05', lastActive: '3 hours ago' },
    { id: '6', name: 'Chen Wei', email: 'chen@example.com', role: 'LICENSED_NURSE', status: 'suspended', verified: true, country: 'China', joinedAt: '2023-11-20', lastActive: '10 days ago' },
    { id: '7', name: 'Emily Brown', email: 'emily@example.com', role: 'NURSE_STUDENT', status: 'active', verified: false, country: 'UK', joinedAt: '2024-03-15', lastActive: '30 mins ago' },
    { id: '8', name: 'Robert Kim', email: 'robert@example.com', role: 'MIGRATING_NURSE', status: 'active', verified: true, country: 'South Korea', joinedAt: '2024-02-01', lastActive: '6 hours ago' },
    { id: '9', name: 'Ahmed Hassan', email: 'ahmed@example.com', role: 'LICENSED_NURSE', status: 'active', verified: true, country: 'UAE', joinedAt: '2024-01-20', lastActive: '4 hours ago' },
    { id: '10', name: 'Fatima Ali', email: 'fatima@example.com', role: 'NURSE_STUDENT', status: 'pending', verified: false, country: 'Saudi Arabia', joinedAt: '2024-03-18', lastActive: '1 hour ago' },
  ]);

  const [verifications, setVerifications] = useState<VerificationRequest[]>([
    { id: '1', userId: '3', userName: 'James Wilson', userEmail: 'james@example.com', role: 'MIGRATING_NURSE', documents: [{ name: 'nursing_license.pdf', url: '#' }, { name: 'passport.pdf', url: '#' }], submittedAt: '2024-03-18', status: 'pending' },
    { id: '2', userId: '7', userName: 'Emily Brown', userEmail: 'emily@example.com', role: 'NURSE_STUDENT', documents: [{ name: 'student_id.pdf', url: '#' }, { name: 'enrollment_letter.pdf', url: '#' }], submittedAt: '2024-03-17', status: 'pending' },
    { id: '3', userId: '9', userName: 'Ahmed Hassan', userEmail: 'ahmed@example.com', role: 'LICENSED_NURSE', documents: [{ name: 'license_certificate.pdf', url: '#' }, { name: 'id_card.pdf', url: '#' }], submittedAt: '2024-03-16', status: 'approved' },
    { id: '4', userId: '10', userName: 'Fatima Ali', userEmail: 'fatima@example.com', role: 'REGULATORY_BODY', documents: [{ name: 'organization_docs.pdf', url: '#' }, { name: 'official_letter.pdf', url: '#' }], submittedAt: '2024-03-15', status: 'pending' },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', title: 'NCLEX Passing Standard Update', content: 'Important update regarding NCLEX passing standards for 2026. All migrating nurses should review the new requirements.', author: CREATOR_USER.name, createdAt: '2024-03-15', status: 'active', targetAudience: 'All Users' },
    { id: '2', title: 'New Migration Pathway Added', content: 'We have added new migration pathways for Australia. Check the updated requirements and start your journey today!', author: CREATOR_USER.name, createdAt: '2024-03-10', status: 'active', targetAudience: 'Migrating Nurses' },
    { id: '3', title: 'Platform Maintenance Notice', content: 'Scheduled maintenance on March 25th from 2AM-4AM EST. Some features may be temporarily unavailable.', author: CREATOR_USER.name, createdAt: '2024-03-18', status: 'draft', targetAudience: 'All Users' },
  ]);

  const [messages, setMessages] = useState<Message[]>([]);

  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    { id: '1', name: 'AI Study Tutor', description: 'Enable AI-powered study assistance', enabled: true, rolloutPercentage: 100, category: 'AI Features' },
    { id: '2', name: 'Video Consultation', description: 'Enable video consultation feature', enabled: false, rolloutPercentage: 0, category: 'Features' },
    { id: '3', name: 'Blockchain Credentials', description: 'Verify credentials on blockchain', enabled: true, rolloutPercentage: 50, category: 'Security' },
    { id: '4', name: 'Live Q&A Sessions', description: 'Enable live Q&A with regulators', enabled: true, rolloutPercentage: 100, category: 'Community' },
    { id: '5', name: 'Gamification', description: 'Enable badges and rewards system', enabled: true, rolloutPercentage: 100, category: 'Engagement' },
    { id: '6', name: 'Marketplace', description: 'Enable nurse marketplace', enabled: true, rolloutPercentage: 80, category: 'Features' },
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    { id: '1', action: 'User Verified', performedBy: CREATOR_USER.name, target: 'Ahmed Hassan', timestamp: '2024-03-18 14:30', details: 'Approved nursing license verification' },
    { id: '2', action: 'User Suspended', performedBy: CREATOR_USER.name, target: 'Chen Wei', timestamp: '2024-03-18 13:15', details: 'Account suspended for policy violation' },
    { id: '3', action: 'Feature Toggled', performedBy: CREATOR_USER.name, target: 'Video Consultation', timestamp: '2024-03-18 11:00', details: 'Enabled feature for beta testing' },
    { id: '4', action: 'Announcement Posted', performedBy: CREATOR_USER.name, target: 'NCLEX Update', timestamp: '2024-03-18 10:30', details: 'Published announcement to all users' },
    { id: '5', action: 'Message Sent', performedBy: CREATOR_USER.name, target: 'Sarah Johnson', timestamp: '2024-03-18 09:00', details: 'Welcome message sent via AI' },
  ]);

  const stats = {
    totalUsers: 52478,
    activeUsers: 12543,
    pendingVerifications: verifications.filter(v => v.status === 'pending').length,
    totalMigrations: 3421,
    examAttempts: 125680,
    passRate: 94.5,
  };

  const menuItems = [
    { id: 'overview', icon: <BarChart3 size={20} />, label: 'Overview', badge: null },
    { id: 'users', icon: <Users size={20} />, label: 'User Management', badge: users.filter(u => u.status === 'pending').length || null },
    { id: 'verifications', icon: <Shield size={20} />, label: 'Verifications', badge: verifications.filter(v => v.status === 'pending').length || null },
    { id: 'hospitals', icon: <Building size={20} />, label: 'Hospitals', badge: hospitals.filter(h => h.status === 'active').length || null },
    { id: 'content', icon: <FileCheck size={20} />, label: 'Content', badge: null },
    { id: 'messages', icon: <MessageSquare size={20} />, label: 'Messages', badge: messages.length || null },
    { id: 'announcements', icon: <Bell size={20} />, label: 'Announcements', badge: announcements.filter(a => a.status === 'draft').length || null },
    { id: 'features', icon: <Zap size={20} />, label: 'Feature Flags', badge: null },
    { id: 'analytics', icon: <TrendingUp size={20} />, label: 'Analytics', badge: null },
    { id: 'security', icon: <Lock size={20} />, label: 'Security & Logs', badge: null },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', badge: null },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // User Management Functions
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({ ...user });
  };

  const handleSaveUser = () => {
    if (userForm) {
      setUsers(users.map(u => u.id === userForm.id ? userForm : u));
      setEditingUser(null);
      setUserForm(null);
      showToast('User updated successfully!', 'success');
      addAuditLog('User Updated', userForm.name, `Updated user profile for ${userForm.name}`);
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        addAuditLog(newStatus === 'suspended' ? 'User Suspended' : 'User Activated', u.name, `Changed status to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
    showToast('User status updated!', 'success');
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== userId));
      addAuditLog('User Deleted', user.name, `Deleted user account`);
      showToast('User deleted successfully!', 'success');
    }
  };

  // Message Functions
  const handleOpenMessage = (user: User, type: 'welcome' | 'custom' = 'custom') => {
    setMessageRecipient(user);
    setMessageType(type);
    setShowMessageModal(true);
    if (type === 'welcome') {
      setMessageContent(`Dear ${user.name},

Welcome to NurseSphere! 🎉

We're thrilled to have you join our community of ${stats.totalUsers.toLocaleString()}+ nurses worldwide.

As you begin your journey with us, here are some tips to get started:

1. Complete your profile to connect with other nurses
2. Explore our AI-powered study tools
3. Join communities relevant to your goals
4. Track your migration or exam progress

If you have any questions, don't hesitate to reach out. We're here to support you every step of the way!

Best regards,
${CREATOR_USER.name}
Founder, NurseSphere

"Revolutionizing Global Nursing"`);
    }
  };

  const handleSendMessage = () => {
    if (messageRecipient && messageContent) {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        recipientId: messageRecipient.id,
        recipientName: messageRecipient.name,
        subject: messageType === 'welcome' ? 'Welcome to NurseSphere!' : 'Message from NurseSphere Team',
        content: messageContent,
        sentAt: new Date().toISOString(),
        type: messageType,
        status: 'sent'
      };
      setMessages([...messages, newMessage]);
      setShowMessageModal(false);
      setMessageContent('');
      setMessageRecipient(null);
      showToast(`Message sent to ${newMessage.recipientName}!`, 'success');
      addAuditLog('Message Sent', newMessage.recipientName, `${messageType === 'welcome' ? 'Welcome' : 'Custom'} message sent`);
    }
  };

  const generateAiSuggestion = () => {
    if (!messageRecipient) return;
    
    const suggestions = [
      `Hi ${messageRecipient.name}! Just checking in to see how your journey with NurseSphere is going. Remember, our AI tools are here to help 24/7!`,
      `${messageRecipient.name}, we noticed you haven't logged in for a while. Is everything okay? Let us know if you need any assistance!`,
      `Great to have you here, ${messageRecipient.name}! Your ${messageRecipient.role.replace(/_/g, ' ')} journey is just getting started. Here's a quick tip: check out our NCLEX prep module!`,
    ];
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  // Verification Functions
  const handleApproveVerification = (verification: VerificationRequest) => {
    setVerifications(verifications.map(v => 
      v.id === verification.id ? { ...v, status: 'approved' as const } : v
    ));
    setUsers(users.map(u => 
      u.email === verification.userEmail ? { ...u, verified: true, status: 'active' as const } : u
    ));
    showToast(`Verification approved for ${verification.userName}!`, 'success');
    addAuditLog('Verification Approved', verification.userName, `Approved ${verification.role.replace(/_/g, ' ')} verification`);
    
    // Auto-send welcome message
    const user = users.find(u => u.email === verification.userEmail);
    if (user) {
      handleOpenMessage(user, 'welcome');
    }
  };

  const handleRejectVerification = (verification: VerificationRequest) => {
    if (reviewNotes.trim()) {
      setVerifications(verifications.map(v => 
        v.id === verification.id ? { ...v, status: 'rejected' as const, notes: reviewNotes } : v
      ));
      showToast(`Verification rejected for ${verification.userName}`, 'info');
      addAuditLog('Verification Rejected', verification.userName, `Rejected: ${reviewNotes}`);
      setSelectedVerification(null);
      setReviewNotes('');
    } else {
      showToast('Please provide rejection reason', 'error');
    }
  };

  // Announcement Functions
  const handleCreateAnnouncement = () => {
    if (announcementForm.title && announcementForm.content) {
      const newAnnouncement: Announcement = {
        id: `ann_${Date.now()}`,
        ...announcementForm,
        author: CREATOR_USER.name,
        createdAt: new Date().toISOString()
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: '', content: '', targetAudience: 'All Users', status: 'draft' });
      showToast('Announcement created successfully!', 'success');
      addAuditLog('Announcement Created', newAnnouncement.title, `Created new announcement`);
    } else {
      showToast('Please fill in all required fields', 'error');
    }
  };

  const handlePublishAnnouncement = (announcementId: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === announcementId ? { ...a, status: 'active' as const } : a
    ));
    showToast('Announcement published!', 'success');
    addAuditLog('Announcement Published', announcements.find(a => a.id === announcementId)?.title || '', 'Published announcement');
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== announcementId));
      showToast('Announcement deleted!', 'success');
    }
  };

  // Feature Toggle
  const handleToggleFeature = (featureId: string) => {
    setFeatureFlags(featureFlags.map(f => 
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
    const feature = featureFlags.find(f => f.id === featureId);
    if (feature) {
      addAuditLog('Feature Toggled', feature.name, `${feature.enabled ? 'Disabled' : 'Enabled'} ${feature.name}`);
    }
  };

  // Audit Log Helper
  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      action,
      performedBy: CREATOR_USER.name,
      target,
      timestamp: new Date().toLocaleString(),
      details
    };
    auditLogs.unshift(newLog);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      LICENSED_NURSE: '#10B981',
      NURSE_STUDENT: '#6366F1',
      MIGRATING_NURSE: '#F59E0B',
      REGULATORY_BODY: '#8B5CF6',
      NURSE_ADVOCATE: '#EC4899',
      ADMIN: '#EF4444',
    };
    return colors[role] || '#6366F1';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-500/20 text-emerald-400',
      pending: 'bg-amber-500/20 text-amber-400',
      suspended: 'bg-red-500/20 text-red-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      approved: 'bg-emerald-500/20 text-emerald-400',
      rejected: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-xl shadow-2xl ${
              toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'
            } text-white font-medium flex items-center gap-3`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : toast.type === 'error' ? <AlertCircle size={20} /> : <Bell size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Nav Tabs */}
      <div className="flex flex-nowrap lg:flex-wrap gap-1.5 p-1 rounded-xl bg-card border border-border overflow-x-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === item.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent'
            }`}
          >
            <span className="text-foreground">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge ? (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{item.badge}</Badge>
            ) : null}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Founder Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/30 p-6 md:p-8"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 md:w-80 h-60 md:h-80 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 md:w-60 h-40 md:h-60 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-full blur-3xl" />
              </div>
              <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-xl shadow-amber-500/30">
                    M
                    <div className="absolute -top-2 -right-2 w-6 md:w-8 h-6 md:h-8 bg-amber-400 rounded-full flex items-center justify-center">
                      <Crown size={16} className="text-amber-900" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">Welcome, {CREATOR_USER.name}!</h2>
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-xs md:text-sm font-bold flex items-center gap-1">
                      <Crown size={12} />
                      FOUNDER & CREATOR
                    </span>
                  </div>
                  <p className="text-amber-300/90 text-sm md:text-lg mb-3">{CREATOR_USER.creatorTitle}</p>
                  <p className="text-card-foreground/80 text-xs md:text-sm max-w-2xl">
                    As the visionary behind NurseSphere, you're revolutionizing how nurses worldwide connect, learn, and advance their careers.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                      <Rocket size={16} className="text-amber-400" />
                      <span className="text-xs md:text-sm text-foreground font-medium">Revolutionizing Nursing</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                      <Globe size={16} className="text-amber-400" />
                      <span className="text-xs md:text-sm text-foreground font-medium">{stats.totalUsers.toLocaleString()}+ Impacted</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: '#6366F1', trend: '+12.5%' },
                { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: Activity, color: '#10B981', trend: '+8.2%' },
                { label: 'Pending Verify', value: stats.pendingVerifications, icon: Shield, color: '#F59E0B', trend: '-15%' },
                { label: 'Total Migrations', value: stats.totalMigrations.toLocaleString(), icon: Globe, color: '#8B5CF6', trend: '+23.1%' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative overflow-hidden rounded-xl md:rounded-2xl bg-card border border-border p-4 md:p-6"
                >
                  <div className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 rounded-full blur-3xl opacity-20" style={{ background: stat.color }} />
                  <div className="relative">
                    <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4" style={{ background: `${stat.color}20` }}>
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                      <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                        <TrendingUp size={12} /> {stat.trend}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Users size={20} />, label: 'Manage Users', color: '#6366F1', section: 'users' },
                { icon: <Shield size={20} />, label: 'Verify Users', color: '#10B981', section: 'verifications' },
                { icon: <MessageSquare size={20} />, label: 'Send Message', color: '#F59E0B', section: 'messages' },
                { icon: <Bell size={20} />, label: 'Announce', color: '#8B5CF6', section: 'announcements' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(action.section)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-border transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${action.color}20` }}>
                    <span style={{ color: action.color }}>{action.icon}</span>
                  </div>
                  <span className="font-medium text-card-foreground group-hover:text-foreground transition-colors text-sm md:text-base">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Activity size={16} className="text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{log.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground/70 flex-shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* User Management */}
        {activeSection === 'users' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">User Management</h2>
                <p className="text-sm text-muted-foreground">{filteredUsers.length} users found</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground focus:border-primary/50 outline-none cursor-pointer text-sm"
              >
                <option value="">All Roles</option>
                <option value="LICENSED_NURSE">Licensed Nurse</option>
                <option value="NURSE_STUDENT">Nurse Student</option>
                <option value="MIGRATING_NURSE">Migrating Nurse</option>
                <option value="REGULATORY_BODY">Regulatory Body</option>
                <option value="NURSE_ADVOCATE">Nurse Advocate</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground focus:border-primary/50 outline-none cursor-pointer text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="rounded-xl md:rounded-2xl bg-card border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Verified</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Country</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs md:text-sm flex-shrink-0">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="px-2 py-1 rounded-full text-[10px] md:text-xs font-medium" style={{ background: `${getRoleColor(user.role)}20`, color: getRoleColor(user.role) }}>
                            {user.role.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {user.verified ? (
                            <CheckCircle size={18} className="text-emerald-400" />
                          ) : (
                            <XCircle size={18} className="text-muted-foreground/70" />
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-sm text-card-foreground">{user.country}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 md:gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenMessage(user)} title="Send Message">
                              <MessageSquare size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Edit User">
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={user.status === 'active' ? 'hover:bg-amber-500/20 hover:text-amber-400' : 'hover:bg-emerald-500/20 hover:text-emerald-400'}
                              title={user.status === 'active' ? 'Suspend' : 'Activate'}
                            >
                              {user.status === 'active' ? <Ban size={16} /> : <Unlock size={16} />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="hover:bg-red-500/20 hover:text-red-400" title="Delete">
                              <Trash size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Verifications */}
        {activeSection === 'verifications' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Verification Management</h2>
                <p className="text-sm text-muted-foreground">Review and approve document submissions</p>
              </div>
            </div>

            {/* Verification Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Pending', value: verifications.filter(v => v.status === 'pending').length, color: '#F59E0B' },
                { label: 'Approved', value: verifications.filter(v => v.status === 'approved').length, color: '#10B981' },
                { label: 'Rejected', value: verifications.filter(v => v.status === 'rejected').length, color: '#EF4444' },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Verification Requests */}
            <div className="space-y-4">
              {verifications.map((verification) => (
                <Card key={verification.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {verification.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{verification.userName}</p>
                          <p className="text-sm text-muted-foreground">{verification.userEmail}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                        {verification.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Role</p>
                        <p className="font-medium text-foreground">{verification.role.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                        <p className="font-medium text-foreground">{new Date(verification.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {verification.documents.map((doc, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-muted text-card-foreground text-xs flex items-center gap-2">
                            <FileText size={12} />
                            {doc.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {verification.status === 'pending' && (
                      <div className="space-y-3 pt-4 border-t border-border">
                        <textarea
                          placeholder="Add review notes (required for rejection)..."
                          value={selectedVerification?.id === verification.id ? reviewNotes : ''}
                          onChange={(e) => {
                            setSelectedVerification(verification);
                            setReviewNotes(e.target.value);
                          }}
                          className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 outline-none transition-all text-sm resize-none"
                          rows={2}
                        />
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <Button
                            variant="success"
                            onClick={() => handleApproveVerification(verification)}
                            className="flex-1"
                          >
                            <CheckCircle size={16} className="mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRejectVerification(verification)}
                            disabled={!reviewNotes.trim()}
                            className="flex-1"
                          >
                            <XCircle size={16} className="mr-2" />
                            Reject
                          </Button>
                          <Button variant="outline">
                            <Eye size={16} className="mr-2" />
                            Review Docs
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hospitals */}
        {activeSection === 'hospitals' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Hospital Clients</h2>
                <p className="text-sm text-muted-foreground">Manage hospital recruitment licenses and accounts</p>
              </div>
              <Button variant="default">
                <Plus size={16} className="mr-2" />
                Add Hospital
              </Button>
            </div>

            {/* Hospital Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Building size={20} className="text-amber-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Hospitals</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{hospitals.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle size={20} className="text-emerald-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Active</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{hospitals.filter(h => h.status === 'active').length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <CreditCard size={20} className="text-violet-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Monthly Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">${hospitals.reduce((sum, h) => sum + h.mrr, 0).toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Briefcase size={20} className="text-blue-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Jobs Posted</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{hospitals.reduce((sum, h) => sum + h.jobPostingsUsed, 0)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Hospital List */}
            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <Card key={hospital.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                          <Building size={24} className="text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">{hospital.hospitalName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              hospital.status === 'active' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {hospital.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{hospital.name} ({hospital.email})</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          hospital.licenseTier === 'enterprise' 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : hospital.licenseTier === 'professional'
                              ? 'bg-violet-500/20 text-violet-400'
                              : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {hospital.licenseTier.charAt(0).toUpperCase() + hospital.licenseTier.slice(1)}
                        </div>
                        <p className="text-lg font-bold text-foreground mt-1">${hospital.mrr}/mo</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground/70 mb-1">Job Postings</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${Math.min((hospital.jobPostingsUsed / (hospital.jobPostingsLimit === -1 ? hospital.jobPostingsUsed : hospital.jobPostingsLimit)) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {hospital.jobPostingsUsed}/{hospital.jobPostingsLimit === -1 ? '∞' : hospital.jobPostingsLimit}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground/70 mb-1">Nurse Access</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${Math.min((hospital.nurseAccessUsed / (hospital.nurseAccessLimit === -1 ? hospital.nurseAccessUsed : hospital.nurseAccessLimit)) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {hospital.nurseAccessUsed}/{hospital.nurseAccessLimit === -1 ? '∞' : hospital.nurseAccessLimit}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground/70 mb-1">Subscribed</p>
                        <p className="text-sm text-foreground">{new Date(hospital.subscribedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground/70 mb-1">Expires</p>
                        <p className="text-sm text-foreground">{new Date(hospital.expiresAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>

                  <div className="px-5 py-3 bg-muted/50 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setHospitals(hospitals.map(h => 
                          h.id === hospital.id 
                            ? { ...h, status: h.status === 'active' ? 'suspended' : 'active' }
                            : h
                        ));
                      }}
                      className={hospital.status === 'active' ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20'}
                    >
                      {hospital.status === 'active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {activeSection === 'messages' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Direct Messages</h2>
                <p className="text-sm text-muted-foreground">Send personalized messages with AI assistance</p>
              </div>
              <Button
                variant="default"
                onClick={() => { setMessageRecipient(null); setShowMessageModal(true); }}
              >
                <Plus size={16} className="mr-2" />
                New Message
              </Button>
            </div>

            {/* Recent Messages */}
            <div className="space-y-4">
              {messages.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                    <p className="text-muted-foreground">No messages sent yet</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Send your first message to a user</p>
                  </CardContent>
                </Card>
              ) : (
                messages.map((msg) => (
                  <Card key={msg.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">{msg.recipientName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(msg.sentAt).toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${msg.type === 'welcome' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                          {msg.type === 'welcome' ? 'Welcome' : 'Custom'}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground line-clamp-2">{msg.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Quick Send Section */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const unverifiedUsers = users.filter(u => !u.verified && u.status !== 'suspended');
                      if (unverifiedUsers[0]) handleOpenMessage(unverifiedUsers[0], 'welcome');
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20 hover:border-success/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <UserPlus size={20} className="text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Send Welcome</p>
                      <p className="text-xs text-muted-foreground">AI-generated welcome message</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      const pendingUsers = users.filter(u => u.status === 'pending');
                      if (pendingUsers[0]) handleOpenMessage(pendingUsers[0], 'custom');
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Bell size={20} className="text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Remind Pending</p>
                      <p className="text-xs text-muted-foreground">Message pending users</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Announcements */}
        {activeSection === 'announcements' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Announcements</h2>
                <p className="text-sm text-muted-foreground">Create and manage platform announcements</p>
              </div>
              <Button
                variant="default"
                onClick={() => { setEditingAnnouncement(null); setShowAnnouncementModal(true); }}
              >
                <Plus size={16} className="mr-2" />
                New Announcement
              </Button>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-foreground">{announcement.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(announcement.status)}`}>
                            {announcement.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/70">
                          <span>By {announcement.author}</span>
                          <span>•</span>
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{announcement.targetAudience}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {announcement.status === 'draft' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handlePublishAnnouncement(announcement.id)}
                          >
                            <Send size={14} className="mr-1" />
                            Publish
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feature Flags */}
        {activeSection === 'features' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Feature Flags</h2>
                <p className="text-sm text-muted-foreground">Control platform features and rollouts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {featureFlags.map((flag) => (
                <Card key={flag.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-foreground">{flag.name}</p>
                        <p className="text-sm text-muted-foreground">{flag.description}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-muted text-card-foreground">
                        {flag.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Rollout</span>
                          <span className="text-sm font-medium text-foreground">{flag.rolloutPercentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${flag.rolloutPercentage}%`,
                              background: flag.enabled
                                ? 'linear-gradient(90deg, #6366F1, #10B981)'
                                : '#EF4444'
                            }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleFeature(flag.id)}
                        className={`relative w-12 md:w-14 h-7 md:h-8 rounded-full transition-all flex-shrink-0 ${
                          flag.enabled ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 md:w-6 h-5 md:h-6 rounded-full bg-white shadow-lg transition-all ${
                            flag.enabled ? 'left-7 md:left-8' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics */}
        {activeSection === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Platform Analytics</h2>
                <p className="text-sm text-muted-foreground">Comprehensive platform metrics and insights</p>
              </div>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Daily Active Users', value: '8,432', trend: '+5.2%' },
                { label: 'Avg. Session Time', value: '24m', trend: '+12%' },
                { label: 'Bounce Rate', value: '32%', trend: '-8%' },
                { label: 'Conversion Rate', value: '4.8%', trend: '+15%' },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-end justify-between mt-2">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <span className="text-sm font-medium text-emerald-400">{stat.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground/70">
                  <div className="text-center">
                    <TrendingUp size={48} className="mx-auto mb-2" />
                    <p>Chart visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Security & Logs */}
        {activeSection === 'security' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Security & Audit Logs</h2>
                <p className="text-sm text-muted-foreground">Monitor platform security and track admin actions</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'System Status', value: 'Healthy', icon: CheckCircle, color: '#10B981' },
                { label: 'Active Sessions', value: '1,247', icon: Activity, color: '#6366F1' },
                { label: 'Failed Logins (24h)', value: '12', icon: AlertTriangle, color: '#F59E0B' },
                { label: 'Security Score', value: '98%', icon: Shield, color: '#8B5CF6' },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon size={16} style={{ color: stat.color }} />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Logs</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border max-h-96 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-accent/30 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Activity size={18} className="text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{log.action}</p>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-foreground">{log.performedBy}</p>
                        <p className="text-xs text-muted-foreground/70">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Settings */}
        {activeSection === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Platform Settings</h2>
              <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Platform Name</label>
                    <Input
                      type="text"
                      defaultValue="NurseSphere"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Support Email</label>
                    <Input
                      type="email"
                      defaultValue="support@nursphere.com"
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-card-foreground">Maintenance Mode</span>
                    <button className="relative w-12 h-7 rounded-full bg-muted">
                      <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-card-foreground">Registration Open</span>
                    <button className="relative w-12 h-7 rounded-full bg-primary">
                      <span className="absolute top-1 left-7 w-5 h-5 rounded-full bg-white shadow" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Founder Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      M
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{CREATOR_USER.name}</p>
                      <p className="text-sm text-amber-400">{CREATOR_USER.email}</p>
                    </div>
                    <span className="ml-auto px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium flex items-center gap-1">
                      <Crown size={12} />
                      Founder
                    </span>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Bio</p>
                    <p className="text-sm text-foreground">{CREATOR_USER.creatorTitle}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button variant="default" className="px-6 py-3">
                Save Changes
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowMessageModal(false)}>
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Send Message</h3>
                  <p className="text-sm text-muted-foreground">
                    {messageRecipient ? `To: ${messageRecipient.name}` : 'Broadcast Message'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowMessageModal(false)}>
                  <X size={20} />
                </Button>
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Message Type</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setMessageType('welcome')}
                    variant={messageType === 'welcome' ? 'default' : 'secondary'}
                    className="flex-1"
                  >
                    <Sparkles size={16} className="mr-2" />
                    Welcome Message (AI)
                  </Button>
                  <Button
                    onClick={() => setMessageType('custom')}
                    variant={messageType === 'custom' ? 'default' : 'secondary'}
                    className="flex-1"
                  >
                    <Edit size={16} className="mr-2" />
                    Custom Message
                  </Button>
                </div>
              </div>

              {messageType === 'custom' && (
                <div>
                  <button
                    onClick={generateAiSuggestion}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-all text-sm mb-3"
                  >
                    <Sparkles size={16} />
                    Get AI Suggestion
                  </button>
                  {aiSuggestion && (
                    <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-sm text-violet-300 mb-3">
                      <p className="font-medium mb-1">AI Suggestion:</p>
                      <p>{aiSuggestion}</p>
                      <button
                        onClick={() => { setMessageContent(aiSuggestion); setAiSuggestion(''); }}
                        className="mt-2 text-xs text-violet-400 hover:text-violet-300"
                      >
                        Use this suggestion
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Message</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 outline-none transition-all resize-none"
                  rows={8}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim()}
                >
                  <Send size={16} className="mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && userForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditingUser(null)}>
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Edit User</h3>
                  <p className="text-sm text-muted-foreground">{editingUser.name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)}>
                  <X size={20} />
                </Button>
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Name</label>
                  <Input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Email</label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-foreground outline-none transition-all text-sm"
                  >
                    <option value="LICENSED_NURSE">Licensed Nurse</option>
                    <option value="NURSE_STUDENT">Nurse Student</option>
                    <option value="MIGRATING_NURSE">Migrating Nurse</option>
                    <option value="REGULATORY_BODY">Regulatory Body</option>
                    <option value="NURSE_ADVOCATE">Nurse Advocate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-foreground outline-none transition-all text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Country</label>
                <Input
                  type="text"
                  value={userForm.country}
                  onChange={(e) => setUserForm({ ...userForm, country: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleSaveUser}
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAnnouncementModal(false)}>
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Create Announcement</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAnnouncementModal(false)}>
                  <X size={20} />
                </Button>
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Title</label>
                <Input
                  type="text"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  placeholder="Announcement title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Content</label>
                <textarea
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  placeholder="Write your announcement..."
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 outline-none transition-all resize-none"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Target Audience</label>
                  <select
                    value={announcementForm.targetAudience}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, targetAudience: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground outline-none transition-all"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Migrating Nurses">Migrating Nurses</option>
                    <option value="Nursing Students">Nursing Students</option>
                    <option value="Licensed Nurses">Licensed Nurses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Status</label>
                  <select
                    value={announcementForm.status}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground outline-none transition-all"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Publish Now</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleCreateAnnouncement}
                >
                  {announcementForm.status === 'active' ? <Send size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                  {announcementForm.status === 'active' ? 'Publish' : 'Save Draft'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
