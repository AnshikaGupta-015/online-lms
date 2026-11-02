import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { RatingStars } from '../components/RatingStars';
import {
  Check,
  PlayCircle,
  Clock,
  BookOpen,
  Users,
  Award,
  Globe,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Share2,
  Lock,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);

  // Fetch Course Detail
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['courseDetail', slug],
    queryFn: () => api.getCourseDetail(slug!),
    enabled: !!slug
  });

  // Toggle section accordion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] !== undefined ? !prev[sectionId] : false
    }));
  };

  // Expand all sections by default once loaded
  React.useEffect(() => {
    if (data?.curriculum) {
      const initial: Record<string, boolean> = {};
      data.curriculum.forEach((sec, idx) => {
        initial[sec.id] = true; // open all by default
      });
      setExpandedSections(initial);
    }
  }, [data?.curriculum]);

  // Enroll Mutation
  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => api.enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseDetail', slug] });
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
      setEnrollSuccessMessage('Successfully enrolled! Redirecting to lesson player...');
      setTimeout(() => {
        navigate(`/learn/${slug}`);
      }, 900);
    }
  });

  // Review Mutation
  const reviewMutation = useMutation({
    mutationFn: (courseId: string) =>
      api.addReview(courseId, { rating: reviewRating, comment: reviewComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseDetail', slug] });
      setReviewComment('');
    }
  });

  const handleEnrollClick = () => {
    if (!user) {
      navigate(`/login?redirect=/courses/${slug}`);
      return;
    }
    if (data?.course) {
      enrollMutation.mutate(data.course.id);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data?.course && reviewComment.trim()) {
      reviewMutation.mutate(data.course.id);
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyLinkSuccess(true);
    setTimeout(() => setCopyLinkSuccess(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
          <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.course) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center max-w-md">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course Not Found</h2>
          <p className="mt-2 text-xs text-slate-500">
            The requested course may have been removed or is pending approval.
          </p>
          <Link
            to="/courses"
            className="mt-6 inline-block px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const { course, instructor, category, aggregates, curriculum, reviews, enrollment } = data;
  const isEnrolled = !!enrollment;

  // Rating breakdown percentages
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });
  const totalRev = reviews.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* COURSE HERO BANNER */}
      <section className="bg-slate-900 text-white py-12 lg:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-4">
              
              {/* Category & Level Strip */}
              <div className="flex items-center gap-2 text-xs text-indigo-400">
                <Link to={`/courses?category=${category?.id}`} className="hover:underline font-medium">
                  {category?.name || 'Computer Science'}
                </Link>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{course.level} Level</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {course.language}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.shortDescription || course.description}
              </p>

              {/* Rating & Social Proof */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <RatingStars
                  rating={aggregates.ratingAverage}
                  showCount={true}
                  count={aggregates.totalReviews}
                  size="md"
                />
                
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-slate-400" />
                  <strong className="font-mono tabular-nums">{aggregates.enrollmentCount}</strong> students enrolled
                </span>

                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="tabular-nums">{(aggregates.totalDurationMinutes / 60).toFixed(1)}</span> hours on-demand
                </span>
              </div>

              {/* Instructor Lead */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={instructor?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(instructor?.fullName || 'Staff')}`}
                  alt={instructor?.fullName || 'Instructor'}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs text-slate-400">Created by</p>
                  <p className="text-xs font-semibold text-white">{instructor?.fullName || 'Lead Architect'}</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* MAIN TWO-ZONE SECTION: Content + Sticky Enroll Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLS: SYLLABUS, WHAT YOU'LL LEARN, REVIEWS */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* WHAT YOU WILL LEARN */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                What You'll Learn in this Masterclass
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                {course.whatYouWillLearn?.map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CURRICULUM ACCORDION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Course Curriculum
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {curriculum?.length || 0} Modules · {aggregates.totalLessons} Lessons · {(aggregates.totalDurationMinutes / 60).toFixed(1)} hrs total length
                  </p>
                </div>

                <button
                  onClick={() => {
                    const allOpen = Object.values(expandedSections).every(Boolean);
                    const next: Record<string, boolean> = {};
                    curriculum?.forEach((s) => {
                      next[s.id] = !allOpen;
                    });
                    setExpandedSections(next);
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {Object.values(expandedSections).every(Boolean) ? 'Collapse all' : 'Expand all'}
                </button>
              </div>

              <div className="space-y-3">
                {curriculum?.map((section, sIndex) => {
                  const isOpen = expandedSections[section.id] !== false;
                  return (
                    <div
                      key={section.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-2xs"
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                          <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                              {section.title}
                            </h3>
                            <span className="text-[11px] text-slate-400 tabular-nums">
                              {section.lessons?.length || 0} lessons
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Section Lessons List */}
                      {isOpen && (
                        <div className="border-t border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/80">
                          {section.lessons?.map((lesson: any) => (
                            <div
                              key={lesson.id}
                              className="px-5 py-3 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {lesson.isFreePreview && (
                                  <button
                                    onClick={() => setPreviewVideoUrl('https://www.youtube.com/watch?v=SqcY0GlETPk')}
                                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                  >
                                    Free Preview
                                  </button>
                                )}
                                <span className="text-slate-400 font-mono tabular-nums text-[11px]">
                                  {lesson.durationMinutes} min
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REQUIREMENTS & DESCRIPTION */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Prerequisites & Requirements
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {course.requirements?.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Detailed Course Description
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            </div>

            {/* INSTRUCTOR CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Instructor Profile
              </h3>
              <div className="flex items-start gap-4">
                <img
                  src={instructor?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(instructor?.fullName || 'Staff')}`}
                  alt={instructor?.fullName || 'Instructor'}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {instructor?.fullName || 'LearnHub Instructor'}
                  </h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    Staff Engineer & Lead Course Creator
                  </p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {instructor?.bio || 'Dedicated software architect committed to educating the next generation of engineers through verified production patterns and system design.'}
                  </p>
                </div>
              </div>
            </div>

            {/* REVIEWS & RATINGS */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Student Feedback & Verified Ratings
                </h3>
                
                {/* Rating summary */}
                <div className="flex items-center gap-6 mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <div className="text-center shrink-0">
                    <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      {aggregates.ratingAverage.toFixed(1)}
                    </div>
                    <div className="mt-1">
                      <RatingStars rating={aggregates.ratingAverage} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 tabular-nums">
                      {aggregates.totalReviews} reviews
                    </div>
                  </div>

                  {/* Rating Breakdown Bars */}
                  <div className="flex-1 space-y-1.5 text-xs">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = ratingCounts[stars] || 0;
                      const pct = totalRev > 0 ? (count / totalRev) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="w-10 text-[11px] text-slate-500 font-medium tabular-nums">{stars} stars</span>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-[11px] text-right text-slate-400 tabular-nums">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* WRITE A REVIEW FORM (Enforced RLS: Enrolled students only!) */}
              {isEnrolled ? (
                <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Leave Your Review
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Your Rating:</span>
                    <RatingStars
                      rating={reviewRating}
                      interactive={true}
                      onRatingChange={(r) => setReviewRating(r)}
                      size="md"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this course, exercises, and instructor..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                  <button
                    type="submit"
                    disabled={reviewMutation.isPending || !reviewComment.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Only enrolled students can submit verified reviews for this masterclass.</span>
                </div>
              )}

              {/* REVIEWS LIST */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to enroll and review!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50/70 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.user?.fullName || 'Student')}`}
                            alt={rev.user?.fullName || 'Student'}
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.user?.fullName || 'Verified Learner'}
                          </span>
                        </div>
                        <RatingStars rating={rev.rating} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLS: STICKY ENROLL CARD */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xl overflow-hidden">
              
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPreviewVideoUrl('https://www.youtube.com/watch?v=SqcY0GlETPk')}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-7 h-7 fill-indigo-600 text-white" />
                  </div>
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  {course.price === 0 ? (
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      Free
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ₹{Math.round(course.price * 1.5).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleShareClick}
                  className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  title="Share Course"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {copyLinkSuccess && (
                <div className="mb-3 p-2 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg">
                  Course link copied to clipboard!
                </div>
              )}

              {enrollSuccessMessage && (
                <div className="mb-3 p-2 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg">
                  {enrollSuccessMessage}
                </div>
              )}

              {/* Action Button: Enroll or Continue */}
              {isEnrolled ? (
                <Link
                  to={`/learn/${course.slug}`}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={enrollMutation.isPending}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <span>{enrollMutation.isPending ? 'Enrolling...' : 'Enroll in Masterclass'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Course Features Checklist */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  This Masterclass Includes:
                </p>
                <div className="flex items-center gap-2.5">
                  <PlayCircle className="w-4 h-4 text-indigo-500" />
                  <span>{(aggregates.totalDurationMinutes / 60).toFixed(1)} hours on-demand video</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>{aggregates.totalLessons} downloadable lessons & exercises</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <span>Verifiable Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Full lifetime access across web & mobile</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* VIDEO PREVIEW MODAL */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-semibold text-white">Free Lesson Preview</span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src="https://www.youtube.com/embed/SqcY0GlETPk?autoplay=1"
                title="Lesson Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
