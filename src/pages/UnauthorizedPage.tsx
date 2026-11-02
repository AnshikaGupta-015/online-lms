import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { role, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Access Restricted
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your current account role ({role || 'Guest'}) does not have sufficient Row-Level Security permissions to view this administrative resource.
        </p>

        <div className="pt-4 flex flex-col gap-2">
          {user ? (
            <Link
              to={role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard'}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Return to Your Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Sign In with Authorized Account
            </Link>
          )}

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
