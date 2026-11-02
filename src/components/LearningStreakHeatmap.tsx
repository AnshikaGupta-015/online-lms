import React, { useState } from 'react';
import { Flame, Trophy, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { LearningStreakData, LearningActivityDay } from '../types';

interface LearningStreakHeatmapProps {
  data: LearningStreakData;
  isLoading?: boolean;
}

export const LearningStreakHeatmap: React.FC<LearningStreakHeatmapProps> = ({
  data,
  isLoading = false
}) => {
  const [hoveredDay, setHoveredDay] = useState<{
    day: LearningActivityDay;
    x: number;
    y: number;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>
    );
  }

  const {
    days = [],
    currentStreak = 0,
    longestStreak = 0,
    totalActiveDays = 0,
    totalLessonsCompleted = 0,
    totalMinutesLearned = 0
  } = data || {};

  // Group into columns of 7 days (Sunday to Saturday or Monday to Sunday)
  // Each day has date string YYYY-MM-DD
  const daysByDate = new Map<string, LearningActivityDay>();
  days.forEach(d => daysByDate.set(d.date, d));

  // Determine starting date: exactly 52 weeks ago
  const now = new Date();
  const dayOfWeekToday = now.getDay(); // 0 is Sunday, 1 is Monday
  const totalDays = 52 * 7 + (dayOfWeekToday + 1);

  // Generate grid columns (weeks)
  const weeks: { weekIndex: number; days: (LearningActivityDay | null)[]; monthLabel?: string }[] = [];
  let currentMonth = -1;

  for (let w = 52; w >= 0; w--) {
    const weekDays: (LearningActivityDay | null)[] = [];
    let weekMonthLabel: string | undefined = undefined;

    for (let d = 0; d < 7; d++) {
      const daysAgo = w * 7 + (6 - d);
      const targetDate = new Date(now.getTime() - daysAgo * 86400000);

      // Don't render future days
      if (targetDate > now) {
        weekDays.push(null);
        continue;
      }

      // Format date in IST
      const dateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(targetDate);

      const month = targetDate.getMonth();
      if (month !== currentMonth && d === 0) {
        currentMonth = month;
        weekMonthLabel = targetDate.toLocaleString('default', { month: 'short' });
      }

      const existingRecord = daysByDate.get(dateStr) || {
        date: dateStr,
        lessonsCompleted: 0,
        minutes: 0,
        quizzesAttempted: 0,
        intensity: 0
      };

      weekDays.push(existingRecord);
    }

    weeks.push({
      weekIndex: 52 - w,
      days: weekDays,
      monthLabel: weekMonthLabel
    });
  }

  // Color intensities for Light and Dark themes
  // Uses professional Coursera / GitHub blue/teal shades
  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 1:
        return 'bg-blue-200 dark:bg-blue-950/80 text-blue-900 border-blue-300 dark:border-blue-900';
      case 2:
        return 'bg-blue-400 dark:bg-blue-700 text-white border-blue-500 dark:border-blue-600';
      case 3:
        return 'bg-[#0056D2] dark:bg-blue-600 text-white border-[#00419e] dark:border-blue-500';
      case 4:
        return 'bg-blue-900 dark:bg-blue-400 text-white dark:text-slate-950 border-blue-950 dark:border-blue-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-800';
    }
  };

  const formatTooltipDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header & Stats Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0056D2] dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daily Learning Streak & Activity
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time activity recorded in Indian Standard Time (IST)
          </p>
        </div>

        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold border border-amber-200/60 dark:border-amber-900/50">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{currentStreak} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold border border-purple-200/60 dark:border-purple-900/50">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span>Best: {longestStreak} Days</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-[#0056D2] dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-200/60 dark:border-blue-900/50">
            <Clock className="w-4 h-4 text-[#0056D2]" />
            <span>{Math.round(totalMinutesLearned / 60)} hrs learned</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-200/60 dark:border-emerald-900/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{totalLessonsCompleted} Lessons</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2 relative">
        <div className="min-w-[760px]">
          {/* Month labels */}
          <div className="flex text-[11px] text-slate-400 mb-1.5 pl-8">
            {weeks.map((w, idx) => (
              <div key={idx} className="w-3.5 mr-1 text-left shrink-0">
                {w.monthLabel ? (
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {w.monthLabel}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          {/* Grid rows with weekday labels */}
          <div className="flex items-start">
            {/* Weekday indicators */}
            <div className="flex flex-col justify-between text-[10px] text-slate-400 dark:text-slate-500 pr-2 h-[105px] select-none shrink-0">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Matrix of days */}
            <div className="flex gap-1">
              {weeks.map((w, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {w.days.map((day, dIdx) => {
                    if (!day) {
                      return <div key={dIdx} className="w-3.5 h-3.5 rounded-sm opacity-0" />;
                    }

                    return (
                      <div
                        key={day.date}
                        onMouseEnter={e => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDay({
                            day,
                            x: rect.left + rect.width / 2,
                            y: rect.top
                          });
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3.5 h-3.5 rounded-sm border transition-all cursor-pointer hover:ring-2 hover:ring-[#0056D2] hover:z-10 ${getIntensityClass(
                          day.intensity
                        )}`}
                        role="gridcell"
                        aria-label={`${day.lessonsCompleted} lessons on ${day.date}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredDay && (
          <div
            className="fixed z-50 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 whitespace-nowrap animate-fade-in border border-slate-700"
            style={{
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y - 6}px`
            }}
          >
            <p className="font-semibold">
              {hoveredDay.day.lessonsCompleted > 0
                ? `${hoveredDay.day.lessonsCompleted} lesson${
                    hoveredDay.day.lessonsCompleted > 1 ? 's' : ''
                  }, ${hoveredDay.day.minutes} min`
                : 'No learning activity'}
            </p>
            <p className="text-[11px] text-slate-400">
              {formatTooltipDate(hoveredDay.day.date)}
            </p>
          </div>
        )}
      </div>

      {/* Legend & Summary Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span>{totalActiveDays} active learning days in the past 12 months</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-950 border border-blue-300 dark:border-blue-900" />
            <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-700 border border-blue-500 dark:border-blue-600" />
            <div className="w-3 h-3 rounded-sm bg-[#0056D2] dark:bg-blue-600 border border-[#00419e] dark:border-blue-500" />
            <div className="w-3 h-3 rounded-sm bg-blue-900 dark:bg-blue-400 border border-blue-950 dark:border-blue-300" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
