'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Bot,
  GraduationCap,
  Calculator,
  Brain,
  ClipboardList,
  Briefcase,
  Globe,
  Building2,
  Users,
  Settings,
  BookOpen,
  Heart,
  MessageCircle,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Plus,
  Shield,
  Zap,
  Award,
  Newspaper,
  TrendingUp,
  Mail,
} from 'lucide-react';
import { useUser, CREATOR_USER } from '@/context/UserContext';
import NurseSphereLogo from '@/components/NurseSphereLogo';
import NotificationBell from '@/components/NotificationBell';
import { searchPages, type SearchEntry } from '@/lib/searchContent';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  creatorOnly?: boolean;
}

const navItems = [
  { href: '/dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { href: '/study-tutor', label: 'AI Tutor', icon: <Bot className="w-4 h-4" /> },
  { href: '/exams', label: 'NCLEX Prep', icon: <GraduationCap className="w-4 h-4" /> },
  { href: '/diagnosis', label: 'AI Diagnosis', icon: <Brain className="w-4 h-4" /> },
  { href: '/dosage', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
  { href: '/logbook', label: 'Logbook', icon: <ClipboardList className="w-4 h-4" /> },
  { href: '/jobs', label: 'Find Jobs', icon: <Briefcase className="w-4 h-4" /> },
  { href: '/migration', label: 'Migration', icon: <Globe className="w-4 h-4" /> },
  { href: '/community', label: 'Community', icon: <Users className="w-4 h-4" /> },
  { href: '/ama', label: 'AMAs', icon: <MessageCircle className="w-4 h-4" /> },
  { href: '/regulators', label: 'Regulators', icon: <Building2 className="w-4 h-4" /> },
  { href: '/messages', label: 'Messages', icon: <Mail className="w-4 h-4" /> },
  { href: '/careers', label: 'Careers', icon: <TrendingUp className="w-4 h-4" /> },
  { href: '/reputation', label: 'Reputation', icon: <Award className="w-4 h-4" /> },
  { href: '/mental-health', label: 'Wellness', icon: <Heart className="w-4 h-4" /> },
  { href: '/research', label: 'Research', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/news', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
  { href: '/marketplace', label: 'Marketplace', icon: <Zap className="w-4 h-4" /> },
  { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

const bottomNavItems = [
  { href: '/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { href: '/study-tutor', label: 'AI Tutor', icon: <Bot className="w-5 h-5" /> },
  { href: '/jobs', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { href: '/messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" /> },
  { href: '/settings', label: 'More', icon: <Menu className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  interface SearchResult {
    href: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
  }

  const searchResults: SearchResult[] = searchQuery.trim()
    ? (() => {
        const navMatches = navItems.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const contentMatches = searchPages(searchQuery);
        const merged = new Map<string, SearchResult>();
        navMatches.forEach(item => merged.set(item.href, { ...item, description: undefined }));
        contentMatches.forEach(item => {
          if (merged.has(item.href)) {
            merged.get(item.href)!.description = item.description;
          } else {
            const navIcon = navItems.find(n => n.href === item.href)?.icon;
            merged.set(item.href, { href: item.href, label: item.label, description: item.description, icon: navIcon ?? null as unknown as React.ReactNode });
          }
        });
        return Array.from(merged.values()).slice(0, 8);
      })()
    : [];

  const isDesktop = windowWidth >= 1024;
  const isMobile = windowWidth < 768;
  const isCreator = user?.email === CREATOR_USER.email || user?.isCreator;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        {isDesktop && (
          <motion.aside
            initial={false}
            animate={{ width: collapsed ? 64 : 240 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed top-0 left-0 bottom-0 bg-card border-r border-border z-50 flex flex-col"
          >
            {/* Logo */}
            <div className={`h-14 flex items-center border-b border-border ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <NurseSphereLogo size={24} animated={false} />
                </div>
                {!collapsed && (
                  <span className="font-semibold text-foreground">NurseSphere</span>
                )}
              </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto py-3 px-2">
              <div className="space-y-0.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 rounded-lg text-sm font-medium transition-colors
                        ${collapsed ? 'justify-center p-2.5' : 'px-3 py-2'}
                        ${isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }
                      `}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className={isActive ? 'text-primary' : ''}>{item.icon}</span>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}

                {isCreator && (
                  <>
                    <div className={`my-3 border-t border-border ${collapsed ? 'mx-2' : 'mx-3'}`} />
                    <Link
                      href="/admin"
                      className={`
                        flex items-center gap-3 rounded-lg text-sm font-medium transition-colors
                        ${collapsed ? 'justify-center p-2.5' : 'px-3 py-2'}
                        ${pathname === '/admin'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'text-amber-500 hover:bg-amber-500/10'
                        }
                      `}
                      title={collapsed ? 'Admin' : undefined}
                    >
                      <Shield className="w-4 h-4" />
                      {!collapsed && <span>Admin</span>}
                    </Link>
                  </>
                )}
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-border p-2">
              <button
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center gap-2 rounded-lg p-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    <span>Collapse</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className={`
                  w-full flex items-center gap-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors
                  ${collapsed ? 'justify-center p-2.5' : 'px-3 py-2'}
                `}
                title={collapsed ? 'Logout' : undefined}
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>
          </motion.aside>
        )}

        {/* Mobile Header */}
        {!isDesktop && (
          <header className="sticky top-0 z-40 h-14 bg-card border-b border-border">
            <div className="h-full px-4 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <NurseSphereLogo size={24} animated={false} />
                </div>
                <span className="font-semibold text-foreground">NurseSphere</span>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Menu className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/50 z-50"
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-72 bg-card z-50 flex flex-col"
              >
                <div className="h-14 flex items-center justify-between px-4 border-b border-border">
                  <span className="font-semibold text-foreground">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-3 px-2">
                  <div className="space-y-0.5">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            flex items-center gap-3 rounded-lg text-sm font-medium transition-colors px-3 py-2
                            ${isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                            }
                          `}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`${isDesktop ? (collapsed ? 'ml-16' : 'ml-60') : ''}`}>
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="h-12 px-4 md:px-6 flex items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchResults.length > 0) {
                        router.push(searchResults[0].href);
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                    className="w-full h-8 pl-9 pr-4 rounded-md bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                      {searchResults.map((item) => (
                        <button
                          key={item.href}
                          onMouseDown={() => { router.push(item.href); setSearchQuery(''); setShowSearchResults(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors text-left"
                        >
                          <span className="text-muted-foreground shrink-0">{item.icon}</span>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
                  <Bell className="w-4 h-4 text-foreground" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {!isMobile && <span>New</span>}
                </button>
                {user && (
                  <div className="hidden md:flex items-center gap-2 h-8 px-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    {!isMobile && (
                      <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        {!isDesktop && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-card border-t border-border">
            <div className="h-full flex justify-around items-center">
              {bottomNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors
                      ${isActive ? 'text-primary' : 'text-muted-foreground'}
                    `}
                  >
                    {item.icon}
                    {!isMobile && (
                      <span className="text-[10px] font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </SidebarContext.Provider>
  );
}
