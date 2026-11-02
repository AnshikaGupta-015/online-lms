import React from 'react';

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm animate-pulse">
      <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
      <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-2.5" />
      <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/60 rounded mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
      ))}
    </div>
  );
};
