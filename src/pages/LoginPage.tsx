import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Sparkles, Shield, User, GraduationCap } from 'lucide-react';

// Demo 1-click login is hidden by default so real users never land in a seed account by mistake.
// To show it during development, add VITE_SHOW_DEMO_LOGIN=true to your .env and restart.
const SHOW_DEMO_LOGIN = import.meta.env.VITE_SHOW_DEMO_LOGIN === 'true';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const { login, switchDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const goAfterLogin = (role: string) => {
    if (redirectPath) {
      navigate(redirectPath);
    } else if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'instructor') {
      navigate('/instructor');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);
      goAfterLogin(res.role);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = async (demoEmail: string) => {
    setError('');
    setIsLoading(true);
    try {
      const assignedRole = await switchDemoUser(demoEmail);
      goAfterLogin(assignedRole);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learn<span className="text-indigo-600">Hub</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-slate-500">
          Access your courses, progress tracking, and certificates.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-6">

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login Grid (development only) */}
          {SHOW_DEMO_LOGIN && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>1-Click Demo Login</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSelect('admin@learnhub.com')}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-center transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-500 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-slate-900 dark:text-white">Admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoSelect('sarah.chen@learnhub.com')}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-center transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-violet-500 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-slate-900 dark:text-white">Instructor</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoSelect('student.elena@learnhub.com')}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-center transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  <User className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-slate-900 dark:text-white">Student</div>
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create an Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};