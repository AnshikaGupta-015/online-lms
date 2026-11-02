import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { BookOpen, CheckCircle2, ArrowLeft, Lock, AlertCircle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!token) {
      setErrorMsg('Missing password reset token in URL.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.confirmResetPassword({ token, newPassword });
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. Token may have expired.');
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
          Create New Password
        </h2>
        <p className="text-xs text-slate-500">
          Enter your new password below to secure your account.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password Updated</span>
              </div>
              <p className="leading-relaxed opacity-90">{successMsg}</p>
              <p className="text-[11px] text-slate-500">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Updating Password...' : 'Save New Password'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
