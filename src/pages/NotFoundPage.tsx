import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">
          404
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The curriculum or resource URL you are trying to access does not exist or has been relocated.
        </p>

        <div className="pt-4 flex flex-col gap-2">
          <Link
            to="/courses"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            Explore Catalog Courses
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
          </Link>
          <Link
            to={`/support?category=bug&from=${encodeURIComponent(location.pathname)}`}
            className="inline-flex items-center justify-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline py-1"
          >
            Think this is a mistake? Report this problem
          </Link>
        </div>
      </div>
    </div>
  );
};
