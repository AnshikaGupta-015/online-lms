import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/Skeleton';
import {
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'in_progress' | 'completed' | 'certificates'>('in_progress');

  // The cache key includes the user id so a previous account's dashboard
  // (e.g. a demo student) is never shown to a different logged-in user.
  const { data, isLoading } = useQuery({
    queryKey: ['studentDashboard', user?.id],
    queryFn: () => api.getStudentDashboard(),
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: 'always'
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <TableSkeleton rows={4} />
        </div>
      </div>
    );
  }

  const stats = data?.stats || { enrolledCount: 0, completedCount: 0, hoursLearned: 0 };
  const inProgressCourses = data?.inProgressCourses || [];
  const completedCourses = data?.completedCourses || [];
  const allCourses = data?.allCourses || [];

  // Hero Continue Learning course (first in-progress course)
  const currentHeroCourse = inProgressCourses[0] || allCourses[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* WELCOME STRIP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {profile?.fullName || 'Scholar'}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Track your learning momentum, finish course milestones, and unlock accredited industry certificates.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <span>Explore More Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Enrolled Courses"
            value={stats.enrolledCount}
            subtitle="Active curriculum registrations"
            icon={<BookOpen className="w-5 h-5" />}
          />
          <StatCard
            label="Completed Milestones"
            value={stats.completedCount}
            subtitle="100% course completions"
            icon={<Award className="w-5 h-5 text-amber-500" />}
          />
          <StatCard
            label="Estimated Hours Learned"
            value={stats.hoursLearned}
            subtitle="Engaged curriculum study time"
            icon={<Clock className="w-5 h-5 text-violet-500" />}
          />
        </div>

        {/* CONTINUE LEARNING HERO CARD */}
        {currentHeroCourse && (
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Resume Active Curriculum
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">
                {currentHeroCourse.course.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentHeroCourse.course.shortDescription || currentHeroCourse.course.description}
              </p>

              <div className="pt-2 max-w-md">
                <div className="flex justify-between text-xs text-indigo-200 mb-1 font-semibold">
                  <span>Overall Progress</span>
                  <span className="font-mono tabular-nums">{currentHeroCourse.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${currentHeroCourse.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to={`/learn/${currentHeroCourse.course.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 text-xs font-bold rounded-xl hover:bg-slate-100 transition-transform hover:-translate-y-0.5 shadow-md"
                >
                  <PlayCircle className="w-4 h-4 text-indigo-600" />
                  <span>Resume Next Lesson</span>
                </Link>
              </div>
            </div>

            {/* Background Graphic Accent */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block">
              <img
                src={currentHeroCourse.course.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        {/* TABS FOR STUDENT COURSES */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'in_progress'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              In Progress ({inProgressCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'completed'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Completed ({completedCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'certificates'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Earned Certificates
            </button>
          </div>

          {/* TAB 1: IN PROGRESS */}
          {activeTab === 'in_progress' && (
            <div className="space-y-4">
              {inProgressCourses.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No courses currently in progress"
                  description="Browse our masterclass catalog and enroll to jumpstart your career."
                  actionText="Explore Courses"
                  onAction={() => (window.location.href = '/courses')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inProgressCourses.map((item) => (
                    <div
                      key={item.enrollment.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={item.course.thumbnailUrl}
                            alt={item.course.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                          {item.course.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          Instructor: {item.instructor?.fullName || 'Faculty'}
                        </p>
                        <ProgressBar progress={item.progressPercent} size="sm" />
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 tabular-nums">
                          {item.completedLessons} of {item.totalLessons} lessons done
                        </span>
                        <Link
                          to={`/learn/${item.course.slug}`}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Continue →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPLETED */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedCourses.length === 0 ? (
                <EmptyState
                  icon={Award}
                  title="No completed courses yet"
                  description="Keep learning your active tracks! Complete 100% of lessons to unlock certificates."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedCourses.map((item) => (
                    <div
                      key={item.enrollment.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                          <img
                            src={item.course.thumbnailUrl}
                            alt={item.course.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                            <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                            {item.enrollment.certificateId && (
                              <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-sm">
                                <Award className="w-3 h-3" />
                                Certificate earned
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.course.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Completed on {new Date(item.enrollment.completedAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <Link
                          to={`/learn/${item.course.slug}`}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline"
                        >
                          Review Syllabus
                        </Link>
                        {item.enrollment.certificateId && (
                          <Link
                            to={`/certificate/${item.enrollment.certificateId}`}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>View Certificate</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              {completedCourses.filter((c) => c.enrollment.certificateId).length === 0 ? (
                <EmptyState
                  icon={Award}
                  title="No certificates issued yet"
                  description="Certificates are generated automatically as soon as you finish 100% of a course's lessons and pass the final exam."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedCourses
                    .filter((c) => c.enrollment.certificateId)
                    .map((item) => (
                      <div
                        key={item.enrollment.certificateId}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-300 dark:border-amber-700/60 p-6 shadow-md flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            Accredited Credential
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.course.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            ID: {item.enrollment.certificateId}
                          </p>
                        </div>
                        <Link
                          to={`/certificate/${item.enrollment.certificateId}`}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-sm"
                        >
                          <span>Print Certificate</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};