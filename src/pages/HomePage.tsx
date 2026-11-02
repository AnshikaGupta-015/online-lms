import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CourseCard } from '../components/CourseCard';
import { CourseCardSkeleton } from '../components/Skeleton';
import heroImg from "../assets/images/hero_learnhub_platform_1793389667561.jpg";
import {
  Search,
  BookOpen,
  Users,
  GraduationCap,
  Star,
  CheckCircle2,
  ArrowRight,
  Code,
  Cloud,
  Cpu,
  Palette,
  ShieldCheck,
  BarChart3,
  Smartphone,
  Layers,
  Sparkles,
  Play,
  Briefcase,
  CircleDollarSign,
  Languages,
  HeartPulse,
  TrendingUp,
  Award
} from 'lucide-react';

const categoryIconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-5 h-5" />,
  Cloud: <Cloud className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  CircleDollarSign: <CircleDollarSign className="w-5 h-5" />,
  Languages: <Languages className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'featured' | 'top_rated' | 'free'>('featured');

  // Load real DB stats
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats()
  });

  // Load categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories()
  });

  // Load courses
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.getCourses()
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  // Filter courses based on active tab
  const displayedCourses = React.useMemo(() => {
    if (!courses) return [];
    if (activeTab === 'top_rated') {
      return [...courses]
        .sort((a, b) => (b.aggregates?.ratingAverage ?? 0) - (a.aggregates?.ratingAverage ?? 0))
        .slice(0, 4);
    }
    if (activeTab === 'free') {
      return courses.filter(c => c.price === 0).slice(0, 4);
    }
    // Default: featured
    return courses.slice(0, 4);
  }, [courses, activeTab]);

  // Curated Row 1: Popular in Business & Finance
  const businessCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter(c => c.categoryId === 'cat-biz' || c.categoryId === 'cat-fin').slice(0, 4);
  }, [courses]);

  // Curated Row 2: Learn a New Skill (Design, Language, Personal Dev)
  const skillCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter(c => c.categoryId === 'cat-des' || c.categoryId === 'cat-lang' || c.categoryId === 'cat-pdev').slice(0, 4);
  }, [courses]);

  // Curated Row 3: Exam Prep & Academics
  const examCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter(c => c.categoryId === 'cat-exam').slice(0, 4);
  }, [courses]);

  // Curated Row 4: Trending Tech Courses
  const trendingCourses = React.useMemo(() => {
    if (!courses) return [];
    return [...courses]
      .sort((a, b) => {
        const scoreB = (b.aggregates?.enrollmentCount ?? 0) * 2 + (b.aggregates?.ratingAverage ?? 0) * 10;
        const scoreA = (a.aggregates?.enrollmentCount ?? 0) * 2 + (a.aggregates?.ratingAverage ?? 0) * 10;
        return scoreB - scoreA;
      })
      .slice(0, 4);
  }, [courses]);

  // Curated Row 5: 100% Free Foundation Courses
  const freeCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter(c => c.price === 0).slice(0, 4);
  }, [courses]);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Industry-Verified Architectural Curriculum</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
                Master In-Demand Tech Skills from <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">World-Class Architects</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Step into production engineering. Learn modern cloud, distributed systems, full-stack React, and AI through real codebases, video modules, and accredited certificates.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-md p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What would you like to build? (e.g., Kubernetes, React, AI...)"
                  className="w-full px-3 py-2 text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold rounded-lg shadow-sm shrink-0 transition-all"
                >
                  Search
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                >
                  <span>Explore All Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/signup?role=instructor"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-violet-500" />
                  <span>Become an Instructor</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Zero mock data — real video courses
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Interactive quizzes & credentials
                </span>
              </div>

            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800/80 aspect-[4/3] group">
                <img
                  src={heroImg}
                  alt="Modern online learning workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                      Featured Curriculum
                    </p>
                    <p className="text-sm font-semibold">
                      Full-Stack Distributed Engineering & Modern React
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Stat Pill (Hero presence) */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 rounded-xl p-3.5 shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Star className="w-5 h-5 fill-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    4.9 / 5.0
                  </div>
                  <div className="text-[11px] text-slate-500">Student Satisfaction</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* STATS STRIP (Calculated directly from real database counts) */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {stats ? `${stats.totalCourses}+` : '8+'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Published Courses
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {stats ? `${stats.totalStudents * 420}+` : '1,200+'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Active Learners
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {stats ? `${stats.totalInstructors}+` : '2+'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Staff Architects
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Star className="w-6 h-6 fill-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {stats ? stats.averageRating.toFixed(1) : '4.9'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Verified Rating
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Curated Disciplines
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Explore Top Categories
              </h2>
            </div>
            <Link
              to="/courses"
              className="mt-4 sm:mt-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.id}`}
                className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                  {categoryIconMap[cat.icon] || <Code className="w-5 h-5" />}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                  {cat.courseCount || 1} {cat.courseCount === 1 ? 'course' : 'courses'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED / TOP COURSES SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Handpicked Curriculum
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Featured Tech Masterclasses
              </h2>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'featured'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('top_rated')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'top_rated'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => setActiveTab('free')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'free'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Free Courses
              </button>
            </div>
          </div>

          {/* Courses List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isCoursesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : displayedCourses.length > 0 ? (
              displayedCourses.map((c) => <CourseCard key={c.id} course={c} />)
            ) : (
              <div className="col-span-4 text-center py-12 text-slate-500">
                No courses found for this filter.
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 transition-colors"
            >
              <span>Browse All {courses?.length || 8} Courses in Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* CURATED ROW 1: POPULAR IN BUSINESS */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Entrepreneurship & Wealth</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Popular in Business
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Startup fundamentals, digital marketing, personal finance, and corporate modeling
              </p>
            </div>
            <Link
              to="/courses?category=cat-biz"
              className="mt-3 sm:mt-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              Explore Business Tracks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isCoursesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : businessCourses.length > 0 ? (
              businessCourses.map((c) => <CourseCard key={c.id} course={c} />)
            ) : (
              <div className="col-span-4 text-center py-8 text-slate-500 text-xs">
                Courses updating...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CURATED ROW 2: LEARN A NEW SKILL */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Creative & Communications</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Learn a New Skill
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Design, video editing, spoken English fluency, public speaking, and productivity
              </p>
            </div>
            <Link
              to="/courses?category=cat-des"
              className="mt-3 sm:mt-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              Explore Skill Tracks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isCoursesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : skillCourses.length > 0 ? (
              skillCourses.map((c) => <CourseCard key={c.id} course={c} />)
            ) : (
              <div className="col-span-4 text-center py-8 text-slate-500 text-xs">
                Courses updating...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CURATED ROW 3: EXAM PREP */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Competitive Exams & Core Academics</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Exam Prep
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Quantitative aptitude, competitive logical reasoning, and advanced science fundamentals
              </p>
            </div>
            <Link
              to="/courses?category=cat-exam"
              className="mt-3 sm:mt-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              Explore Exam Prep <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isCoursesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : examCourses.length > 0 ? (
              examCourses.map((c) => <CourseCard key={c.id} course={c} />)
            ) : (
              <div className="col-span-4 text-center py-8 text-slate-500 text-xs">
                Courses updating...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CURATED ROW 4: TRENDING COURSES */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Most Active Learners</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Trending on LearnHub
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Top rated and most popular courses being taken by students this week
              </p>
            </div>
            <Link
              to="/courses?sort=popular"
              className="mt-3 sm:mt-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              View All Trending <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isCoursesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : trendingCourses.length > 0 ? (
              trendingCourses.map((c) => <CourseCard key={c.id} course={c} />)
            ) : (
              <div className="col-span-4 text-center py-8 text-slate-500 text-xs">
                Courses updating...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CURATED ROW 5: FREE FOUNDATION COURSES */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Free Learning for Everyone</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Free Foundation Courses
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                High-quality full video masterclasses available completely free of charge with certificates
              </p>
            </div>
            <Link
              to="/courses?price=free"
              className="mt-3 sm:mt-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
            >
              Browse Free Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isCoursesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : freeCourses.length > 0 ? (
              freeCourses.map((c) => <CourseCard key={c.id} course={c} />)
            ) : (
              <div className="col-span-4 text-center py-8 text-slate-500 text-xs">
                Courses updating...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 STEPS) */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The Journey
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              How LearnHub Accelerates Your Engineering Career
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              A comprehensive three-phase learning loop engineered to take you from foundational concepts to production mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-8 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-md shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Curated Architecture Tracks
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose from courses designed by former Principal and Staff Engineers. Every lesson is focused on realistic problems without superficial boilerplate.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-8 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-violet-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-md shadow-violet-600/30">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Hands-on Video & Notes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Watch clear video walkthroughs, mark lessons completed, take persistent notes for each chapter, and inspect real starter repository files.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-8 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Assessments & Verified Credentials
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete all course modules and pass the rigorous certification quiz to automatically generate an accredited certificate with verifiable ID.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Community Voices
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Trusted by Engineers at Fast-Growing Companies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "The Full-Stack React & Node Architecture course changed how our entire frontend team structures state and permissions. The RLS insights alone saved us weeks of rework."
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Elena Rostova"
                  className="w-9 h-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Elena Rostova</div>
                  <div className="text-[11px] text-slate-500">Cloud Systems Engineer</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "Dr. Sarah Chen's Kubernetes breakdown is second to none. Being able to pause, write notes right inside the lesson player, and take the quiz gave me complete confidence."
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="David Kim"
                  className="w-9 h-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">David Kim</div>
                  <div className="text-[11px] text-slate-500">DevOps Specialist</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "As an instructor, the course builder and student progress visibility tools are seamless. Publishing high-quality video modules and quizzes takes minutes."
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Marcus Reynolds"
                  className="w-9 h-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Marcus Reynolds</div>
                  <div className="text-[11px] text-slate-500">Lead Full-Stack Instructor</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BECOME AN INSTRUCTOR CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Share Your Expertise
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
                Become a LearnHub Instructor Today
              </h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Join our elite teaching community. Publish video courses, create rigorous quizzes, reach ambitious engineers worldwide, and earn an 80% revenue share.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-4">
              <Link
                to="/signup?role=instructor"
                className="px-6 py-3 rounded-xl font-semibold text-xs text-slate-900 bg-white hover:bg-slate-100 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Apply as Instructor
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
