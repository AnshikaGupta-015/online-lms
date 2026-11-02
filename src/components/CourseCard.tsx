import React from 'react';
import { Link } from 'react-router-dom';
import { Course, isPaidCourse, formatInr } from '../types';
import { RatingStars } from './RatingStars';
import { Clock, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const rating = course.aggregates?.ratingAverage ?? 0;
  const reviewCount = course.aggregates?.totalReviews ?? 0;
  const enrollmentCount = course.aggregates?.enrollmentCount ?? 0;
  const durationHours = course.aggregates?.totalDurationMinutes
    ? (course.aggregates.totalDurationMinutes / 60).toFixed(1)
    : '3.5';

  const formatLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const isFree = !isPaidCourse(course);

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-150 overflow-hidden">
      
      {/* Thumbnail */}
      <Link to={`/courses/${course.slug}`} className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </Link>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4">
        
        {/* Category & Level */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="font-semibold text-[#0056D2] dark:text-blue-400 uppercase tracking-wide text-[11px]">
            {course.category?.name || 'Computer Science'}
          </span>
          <span>·</span>
          <span>{formatLevel(course.level)}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-[#0056D2] dark:group-hover:text-blue-400 transition-colors">
          <Link to={`/courses/${course.slug}`}>
            {course.title}
          </Link>
        </h3>

        {/* Instructor */}
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          {course.instructor?.fullName || 'LearnHub Instructor'}
        </p>

        {/* Rating and Reviews */}
        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={rating} showCount={true} count={reviewCount} size="sm" />
        </div>

        {/* Metadata: Duration & Students */}
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{durationHours}h total</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{enrollmentCount}</span>
          </span>
        </div>

        {/* Bottom: Price / Free Badge */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {isFree ? (
              <span className="inline-block text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Free
              </span>
            ) : (
              <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                {formatInr(course.price)}
              </span>
            )}
          </div>

          <Link
            to={`/courses/${course.slug}`}
            className="text-xs font-semibold text-[#0056D2] dark:text-blue-400 hover:underline"
          >
            Enroll →
          </Link>
        </div>

      </div>
    </article>
  );
};
