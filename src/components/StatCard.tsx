import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  trend
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
      
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
