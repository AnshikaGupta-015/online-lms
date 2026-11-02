import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { BookOpen, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.resetPassword(email);
      setMessage(res.message);
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
          Reset Your Password
        </h2>
        <p className="text-xs text-slate-500">
          Enter your email and we'll send you recovery instructions.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-6">
          
          {message ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instructions Sent</span>
              </div>
              <p className="leading-relaxed opacity-90">{message}</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 block"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Password Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
