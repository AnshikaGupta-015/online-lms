import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'emerald' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = true,
  size = 'md',
  color = 'indigo'
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorGradients = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-violet-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Course Progress</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses[size]}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${heightClasses[size]} ${colorGradients[color]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
