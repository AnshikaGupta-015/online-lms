import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Legend
} from 'recharts';
import { api } from '../lib/api';
import { useTheme } from '../contexts/ThemeContext';
import { LearningStreakHeatmap } from '../components/LearningStreakHeatmap';

export const ProgressReportPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['student-report'],
    queryFn: () => api.getStudentReport(),
    staleTime: 1000 * 60 * 2
  });

  const handlePrint = () => {
    window.print();
  };

  // Chart styling colors based on current theme
  const chartTextColor = isDark ? '#94A3B8' : '#64748B';
  const chartGridColor = isDark ? '#334155' : '#E2E8F0';
  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF';
  const tooltipBorder = isDark ? '#334155' : '#CBD5E1';

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
          <div className="h-80 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Learning Records Found
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Enroll in your first course to track metrics, quiz scores, learning time, and certificates.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0056D2] hover:bg-[#00419e] text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          <span>Explore Course Catalog</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const {
    summary,
    courseStatusBreakdown,
    categoryTimeBreakdown,
    courseProgressList,
    weeklyLessonActivity,
    quizScoresOverTime,
    streak
  } = report;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0056D2] dark:text-blue-400">
              <BarChart3 className="w-4 h-4" />
              <span>Academic Analytics & Progress</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Student Progress Report
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive report of your course completions, quiz scores, study hours, and achievements.
            </p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Download / Print Report</span>
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Back to Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Enrolled</span>
              <BookOpen className="w-4 h-4 text-[#0056D2]" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {summary.enrolledCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Courses in study</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Completed</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {summary.completedCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">100% finished</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>In Progress</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {summary.inProgressCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Active curricula</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Certificates</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
              {summary.certificatesCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Accredited awards</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Avg Quiz Score</span>
              <BarChart3 className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {summary.averageQuizScore}%
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Passing benchmark: 75%</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Total Hours</span>
              <Clock className="w-4 h-4 text-[#0056D2]" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {summary.totalHoursLearned}h
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{summary.totalLessonsCompleted} lessons completed</p>
          </div>
        </div>

        {/* GitHub-style Learning Streak Heatmap */}
        <div>
          <LearningStreakHeatmap data={streak} />
        </div>

        {/* Charts Row 1: Pie / Donut Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Status Donut */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Curriculum Enrollment Status
              </h3>
              <span className="text-xs text-slate-400">Total: {summary.enrolledCount} Courses</span>
            </div>
            <div className="h-64 flex items-center justify-center">
              {courseStatusBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseStatusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {courseStatusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-400">No enrollment status data available</p>
              )}
            </div>
          </div>

          {/* Category Time Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Learning Distribution by Category
              </h3>
              <span className="text-xs text-slate-400">Minutes Studied</span>
            </div>
            <div className="h-64 flex items-center justify-center">
              {categoryTimeBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryTimeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="minutes"
                      nameKey="name"
                    >
                      {categoryTimeBreakdown.map((entry, index) => (
                        <Cell key={`cat-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value} minutes`, 'Time Spent']}
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-400">Complete lessons to see category breakdown</p>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Progress Bars & Weekly Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress % per Course Bar Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Progress Percentage per Course
              </h3>
              <span className="text-xs text-slate-400">0% to 100%</span>
            </div>
            <div className="h-64">
              {courseProgressList.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={courseProgressList.map(c => ({
                      name: c.courseTitle.length > 16 ? c.courseTitle.slice(0, 16) + '...' : c.courseTitle,
                      progress: c.progressPercent
                    }))}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      unit="%"
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Completed']}
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="progress" fill="#0056D2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No courses enrolled
                </div>
              )}
            </div>
          </div>

          {/* Lessons Completed per Week Area/Line Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Weekly Learning Velocity (Last 12 Weeks)
              </h3>
              <span className="text-xs text-slate-400">Lessons Finished</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyLessonActivity} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: chartTextColor, fontSize: 11 }} />
                  <YAxis tick={{ fill: chartTextColor, fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lessonsCompleted"
                    name="Lessons"
                    stroke="#0056D2"
                    strokeWidth={2.5}
                    dot={{ fill: '#0056D2', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quiz Scores Over Time */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Examination Scores Over Time
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pass mark benchmark threshold set at 75%
              </p>
            </div>
          </div>
          <div className="h-64">
            {quizScoresOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizScoresOverTime} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: chartTextColor, fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: chartTextColor, fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Exam Score']}
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <ReferenceLine
                    y={75}
                    label={{ value: 'Pass Threshold (75%)', fill: '#10B981', fontSize: 11 }}
                    stroke="#10B981"
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    dot={{ fill: '#8B5CF6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Take course quizzes to record examination performance metrics.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Per-Course Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Course-by-Course Academic Transcript
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified progress, examination grades, and certified credentials.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-6">Course</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Lessons</th>
                  <th className="py-3 px-4">Completion %</th>
                  <th className="py-3 px-4">Best Quiz</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-6 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {courseProgressList.map(item => (
                  <tr key={item.courseId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={item.thumbnailUrl}
                        alt=""
                        className="w-10 h-8 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/learn/${item.courseSlug}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-[#0056D2] line-clamp-1"
                        >
                          {item.courseTitle}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {item.categoryName}
                    </td>
                    <td className="py-4 px-4">
                      {item.completedLessons} / {item.totalLessons}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.progressPercent === 100 ? 'bg-emerald-500' : 'bg-[#0056D2]'
                            }`}
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-semibold text-[11px]">{item.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {item.bestQuizScore !== null ? (
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.bestQuizScore >= 75
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {item.bestQuizScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not attempted</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.lastActivityAt
                        ? new Date(item.lastActivityAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })
                        : '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {item.certificateCode ? (
                        <Link
                          to={`/verify/${item.certificateCode}`}
                          className="inline-flex items-center gap-1 text-[11px] text-[#0056D2] dark:text-blue-400 font-semibold hover:underline"
                        >
                          <span>{item.certificateCode}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : item.progressPercent === 100 ? (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400">
                          Pass Quiz for Award
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
