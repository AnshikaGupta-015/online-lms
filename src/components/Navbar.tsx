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
  LifeBuoy
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, role, logout, switchDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Wordmark */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Learn<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
          </span>
        </Link>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            to="/courses"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isActive('/courses') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Explore Courses
          </Link>

          {user && role === 'student' && (
            <Link
              to="/dashboard"
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              My Learning
            </Link>
          )}

          {user && role === 'instructor' && (
            <Link
              to="/instructor"
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                isActive('/instructor') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              Instructor Studio
            </Link>
          )}

          {user && role === 'admin' && (
            <Link
              to="/admin"
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                isActive('/admin') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              Admin Moderation
            </Link>
          )}

          <a
            href="#how-it-works"
            onClick={(e) => {
              if (location.pathname !== '/') {
                navigate('/#how-it-works');
              }
            }}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            How It Works
          </a>
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

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
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        Student Dashboard
                      </Link>
                    )}

                    {role === 'instructor' && (
                      <Link
                        to="/instructor"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <GraduationCap className="w-4 h-4 text-violet-500" />
                        Instructor Studio
                      </Link>
                    )}

                    {role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Shield className="w-4 h-4 text-rose-500" />
                        Admin Moderation
                      </Link>
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
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-sm shadow-indigo-500/20 transition-all hover:shadow"
              >
                Get Started
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
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  My Learning Dashboard
                </Link>
              )}
              {role === 'instructor' && (
                <Link
                  to="/instructor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Instructor Studio
                </Link>
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
