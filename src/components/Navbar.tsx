import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../lib/api';
import {
  BookOpen,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  GraduationCap,
  Shield,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
  Bell,
  Award,
  CheckCircle2,
  ExternalLink,
  LifeBuoy,
  Search,
  Receipt,
  FileText,
  BarChart3,
  Layers,
  Laptop
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, role, logout, switchDemoUser } = useAuth();
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [readNotifs, setReadNotifs] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('learnhub_read_notifs') || '[]');
    } catch {
      return [];
    }
  });

  // Query certificates notifications for student / user
  const { data: dashboardData } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => api.getStudentDashboard(),
    enabled: !!user && role === 'student'
  });

  const certNotifications = React.useMemo(() => {
    if (!dashboardData?.completedCourses) return [];
    return dashboardData.completedCourses
      .filter((c: any) => c.enrollment?.certificateId)
      .map((c: any) => ({
        id: `notif-${c.enrollment.certificateId}`,
        title: 'Certificate Awarded!',
        courseTitle: c.course.title,
        code: c.enrollment.certificateId,
        issuedAt: c.enrollment.completedAt || new Date().toISOString()
      }));
  }, [dashboardData]);

  const unreadCount = certNotifications.filter(n => !readNotifs.includes(n.id)).length;

  const handleMarkAllRead = () => {
    const allIds = certNotifications.map(n => n.id);
    setReadNotifs(allIds);
    localStorage.setItem('learnhub_read_notifs', JSON.stringify(allIds));
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleDemoSwitch = async (email: string) => {
    const assignedRole = await switchDemoUser(email);
    setDemoMenuOpen(false);
    setUserDropdownOpen(false);
    if (assignedRole === 'admin') navigate('/admin');
    else if (assignedRole === 'instructor') navigate('/instructor');
    else navigate('/dashboard');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Wordmark & Explore */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-[#0056D2] flex items-center justify-center text-white shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              Learn<span className="text-[#0056D2] dark:text-blue-400">Hub</span>
            </span>
          </Link>

          {/* Explore Dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors border border-slate-300 dark:border-slate-700"
            >
              <Layers className="w-3.5 h-3.5 text-[#0056D2] dark:text-blue-400" />
              <span>Explore</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exploreOpen && (
              <div
                className="absolute left-0 mt-2 w-64 rounded-md bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 p-2 z-50 text-left"
                onMouseLeave={() => setExploreOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Disciplines & Tracks
                </div>
                {[
                  { name: 'Web Development', path: '/courses?category=cat-1' },
                  { name: 'Cloud & DevOps', path: '/courses?category=cat-2' },
                  { name: 'Artificial Intelligence & ML', path: '/courses?category=cat-3' },
                  { name: 'Fullstack & Architecture', path: '/courses?category=cat-8' },
                  { name: 'Mobile App Development', path: '/courses?category=cat-4' },
                  { name: 'All Courses & Certifications', path: '/courses' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setExploreOpen(false)}
                    className="block px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#0056D2] dark:hover:text-blue-400 rounded transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar (Coursera style) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (navSearch.trim()) {
              navigate(`/courses?search=${encodeURIComponent(navSearch.trim())}`);
            } else {
              navigate('/courses');
            }
          }}
          className="hidden md:flex flex-1 max-w-md items-center relative"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="search"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="What do you want to learn today?"
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0056D2] focus:border-[#0056D2] text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
          />
        </form>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Link
            to="/courses"
            className={`whitespace-nowrap transition-colors hover:text-[#0056D2] dark:hover:text-blue-400 ${
              isActive('/courses') ? 'text-[#0056D2] dark:text-blue-400 font-bold' : ''
            }`}
          >
            Courses
          </Link>

          {user && role === 'student' && (
            <>
              <Link
                to="/dashboard"
                className={`whitespace-nowrap transition-colors hover:text-[#0056D2] dark:hover:text-blue-400 ${
                  isActive('/dashboard') ? 'text-[#0056D2] dark:text-blue-400 font-bold' : ''
                }`}
              >
                My Learning
              </Link>
              <Link
                to="/progress"
                className={`whitespace-nowrap transition-colors hover:text-[#0056D2] dark:hover:text-blue-400 ${
                  isActive('/progress') ? 'text-[#0056D2] dark:text-blue-400 font-bold' : ''
                }`}
              >
                Progress
              </Link>
              <Link
                to="/notes-assignments"
                className={`whitespace-nowrap transition-colors hover:text-[#0056D2] dark:hover:text-blue-400 ${
                  isActive('/notes-assignments') ? 'text-[#0056D2] dark:text-blue-400 font-bold' : ''
                }`}
              >
                Notes & Tasks
              </Link>
            </>
          )}

          {user && role === 'instructor' && (
            <>
              <Link
                to="/instructor"
                className={`whitespace-nowrap transition-colors hover:text-[#0056D2] dark:hover:text-blue-400 ${
                  isActive('/instructor') ? 'text-[#0056D2] dark:text-blue-400 font-bold' : ''
                }`}
              >
                Instructor Studio
              </Link>
              <Link
                to="/notes-assignments"
                className={`whitespace-nowrap transition-colors hover:text-[#0056D2] dark:hover:text-blue-400 ${
                  isActive('/notes-assignments') ? 'text-[#0056D2] dark:text-blue-400 font-bold' : ''
                }`}
              >
                Assignments
              </Link>
            </>
          )}

          {user && role === 'admin' && (
            <Link
              to="/admin"
              className={`whitespace-nowrap transition-colors hover:text-[#0056D2] dark:hover:text-blue-400 ${
                isActive('/admin') ? 'text-[#0056D2] dark:text-blue-400 font-bold' : ''
              }`}
            >
              Admin Moderation
            </Link>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Demo Account Switcher Dropdown (D.3: Shows only when DEMO_MODE=true, default off) */}
          {import.meta.env.VITE_DEMO_MODE === 'true' && (
            <div className="relative">
              <button
                onClick={() => {
                  setDemoMenuOpen(!demoMenuOpen);
                  setUserDropdownOpen(false);
                  setNotificationsOpen(false);
                }}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Switch demo accounts to test permissions"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Demo Roles</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Demo Persona
                  </div>
                  
                  <button
                    onClick={() => handleDemoSwitch('admin@learnhub.com')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-rose-500" /> Alex Vance (Admin)
                      </div>
                      <div className="text-slate-500 text-[11px]">admin@learnhub.com</div>
                    </div>
                    {role === 'admin' && <span className="text-[10px] text-indigo-600 font-semibold">Active</span>}
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('sarah.chen@learnhub.com')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-violet-500" /> Dr. Sarah Chen (Instructor)
                      </div>
                      <div className="text-slate-500 text-[11px]">sarah.chen@learnhub.com</div>
                    </div>
                    {user?.email === 'sarah.chen@learnhub.com' && <span className="text-[10px] text-indigo-600 font-semibold">Active</span>}
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('student.elena@learnhub.com')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-500" /> Elena Rostova (Student)
                      </div>
                      <div className="text-slate-500 text-[11px]">student.elena@learnhub.com (100% course certified)</div>
                    </div>
                    {user?.email === 'student.elena@learnhub.com' && <span className="text-[10px] text-indigo-600 font-semibold">Active</span>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Certificate Notification Bell (A.6) */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                  setDemoMenuOpen(false);
                  if (!notificationsOpen && unreadCount > 0) {
                    handleMarkAllRead();
                  }
                }}
                className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Certificate Notifications"
                title="Certificate Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-left animate-in fade-in zoom-in-95 duration-100 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Notifications</span>
                    </span>
                    {certNotifications.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {certNotifications.length} Credential{certNotifications.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {certNotifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No certificate notifications yet. Complete 100% of lessons and pass the final quiz to earn your credentials!
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {certNotifications.map((n) => (
                        <Link
                          key={n.id}
                          to={`/certificate/${n.code}`}
                          onClick={() => setNotificationsOpen(false)}
                          className="block p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                Certificate Awarded!
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {n.courseTitle}
                              </p>
                              <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                                <span>{n.code}</span>
                                <span className="text-slate-400">View →</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Theme Selector (Light / Dark / System) */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              aria-label="Color theme selector"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
              title={`Theme: ${themeMode} (${theme})`}
            >
              {themeMode === 'system' ? <Laptop className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-32 rounded-md bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 p-1 z-50 text-xs text-left"
                onMouseLeave={() => setThemeDropdownOpen(false)}
              >
                <button
                  onClick={() => { setThemeMode('light'); setThemeDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 ${themeMode === 'light' ? 'bg-blue-50 text-[#0056D2] font-semibold dark:bg-slate-800 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  onClick={() => { setThemeMode('dark'); setThemeDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 ${themeMode === 'dark' ? 'bg-blue-50 text-[#0056D2] font-semibold dark:bg-slate-800 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
                <button
                  onClick={() => { setThemeMode('system'); setThemeDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 ${themeMode === 'system' ? 'bg-blue-50 text-[#0056D2] font-semibold dark:bg-slate-800 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <Laptop className="w-3.5 h-3.5" /> System
                </button>
              </div>
            )}
          </div>

          {/* Authentication State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setDemoMenuOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <img
                  src={profile?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile?.fullName || 'User')}`}
                  alt={profile?.fullName || 'User avatar'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  referrerPolicy="no-referrer"
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {profile?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {role}
                    </span>
                  </div>

                  <div className="py-1">
                    {role === 'student' && (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          Student Dashboard
                        </Link>
                        <Link
                          to="/progress"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <BarChart3 className="w-4 h-4 text-indigo-500" />
                          Progress & Analytics
                        </Link>
                        <Link
                          to="/notes-assignments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <FileText className="w-4 h-4 text-emerald-500" />
                          Notes & Assignments
                        </Link>
                        <Link
                          to="/receipts"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Receipt className="w-4 h-4 text-amber-500" />
                          Payment Receipts & Invoices
                        </Link>
                      </>
                    )}

                    {role === 'instructor' && (
                      <>
                        <Link
                          to="/instructor"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <GraduationCap className="w-4 h-4 text-violet-500" />
                          Instructor Studio
                        </Link>
                        <Link
                          to="/notes-assignments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <FileText className="w-4 h-4 text-emerald-500" />
                          Assignments & Grading
                        </Link>
                        <Link
                          to="/receipts"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Receipt className="w-4 h-4 text-amber-500" />
                          Purchase Invoices
                        </Link>
                      </>
                    )}

                    {role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Shield className="w-4 h-4 text-rose-500" />
                          Admin Console
                        </Link>
                        <Link
                          to="/receipts"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Receipt className="w-4 h-4 text-amber-500" />
                          Invoices & Receipts
                        </Link>
                      </>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Profile & Settings
                    </Link>

                    <Link
                      to={`/support?from=${encodeURIComponent(location.pathname)}`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <LifeBuoy className="w-4 h-4 text-indigo-500" />
                      Help & Support
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0056D2] dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0056D2] hover:bg-[#00419e] rounded-md transition-colors"
              >
                Join for Free
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              if (navSearch.trim()) {
                navigate(`/courses?search=${encodeURIComponent(navSearch.trim())}`);
              }
            }}
            className="relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="search"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-white"
            />
          </form>

          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Explore Courses
          </Link>
          {user && (
            <>
              {role === 'student' && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    My Learning
                  </Link>
                  <Link
                    to="/progress"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Progress Report
                  </Link>
                  <Link
                    to="/notes-assignments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Notes & Assignments
                  </Link>
                  <Link
                    to="/receipts"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Payment History & Receipts
                  </Link>
                </>
              )}
              {role === 'instructor' && (
                <>
                  <Link
                    to="/instructor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Instructor Studio
                  </Link>
                  <Link
                    to="/notes-assignments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Assignments & Grading
                  </Link>
                </>
              )}
              {role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Admin Moderation
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Profile & Settings
              </Link>
              <Link
                to={`/support?from=${encodeURIComponent(location.pathname)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Help & Support
              </Link>
            </>
          )}

          {isDemoMode && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <div className="text-xs font-semibold text-slate-400">Quick Demo Logins</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    handleDemoSwitch('admin@learnhub.com');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded font-medium"
                >
                  Admin
                </button>
                <button
                  onClick={() => {
                    handleDemoSwitch('sarah.chen@learnhub.com');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded font-medium"
                >
                  Instructor
                </button>
                <button
                  onClick={() => {
                    handleDemoSwitch('student.elena@learnhub.com');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded font-medium"
                >
                  Student
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
