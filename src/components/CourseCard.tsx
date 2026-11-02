import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { RatingStars } from './RatingStars';
import { Clock, BookOpen, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const rating = course.aggregates?.ratingAverage ?? 0;
  const reviewCount = course.aggregates?.totalReviews ?? 0;
  const enrollmentCount = course.aggregates?.enrollmentCount ?? 0;
  const lessonCount = course.aggregates?.totalLessons ?? 12;
  const durationHours = course.aggregates?.totalDurationMinutes
    ? (course.aggregates.totalDurationMinutes / 60).toFixed(1)
    : '3.5';

  const formatLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      
      {/* Thumbnail with styled fallback */}
      <Link to={`/courses/${course.slug}`} className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Elegant fallback if thumbnail fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Unboxed Metadata Strip (Zero-Pill Discipline) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            {course.category?.name || 'Computer Science'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatLevel(course.level)}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="tabular-nums">{durationHours}h</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <Link to={`/courses/${course.slug}`}>
            {course.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {course.shortDescription || course.description}
        </p>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <img
            src={course.instructor?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(course.instructor?.fullName || 'Faculty')}`}
            alt={course.instructor?.fullName || 'Instructor'}
            className="w-5 h-5 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="font-medium truncate">{course.instructor?.fullName || 'LearnHub Instructor'}</span>
        </div>

        {/* Rating and Students Strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <RatingStars rating={rating} showCount={true} count={reviewCount} size="sm" />
          
          <div className="flex items-center gap-1 text-xs text-slate-400 tabular-nums">
            <Users className="w-3.5 h-3.5" />
            <span>{enrollmentCount}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            {course.price === 0 ? (
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                Free
              </span>
            ) : (
              <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                ₹{course.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <Link
            to={`/courses/${course.slug}`}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform"
          >
            View Syllabus →
          </Link>
        </div>

      </div>
    </article>
  );
};
