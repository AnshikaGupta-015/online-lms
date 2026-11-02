import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CourseCard } from '../components/CourseCard';
import { CourseCardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state with debouncing
  const initialSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Filter states
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedLevel = searchParams.get('level') || 'all';
  const selectedPrice = searchParams.get('price') || 'all';
  const selectedRating = searchParams.get('rating') || 'all';
  const selectedSort = searchParams.get('sort') || 'popular';

  // Mobile drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Debounce search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sync debounced search to URL params
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch.trim()) {
      newParams.set('search', debouncedSearch.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
  }, [debouncedSearch]);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories()
  });

  // Fetch courses with current filters
  const {
    data: courses,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['courses', debouncedSearch, selectedCategory, selectedLevel, selectedPrice, selectedRating, selectedSort],
    queryFn: () =>
      api.getCourses({
        search: debouncedSearch,
        category: selectedCategory,
        level: selectedLevel,
        price: selectedPrice,
        rating: selectedRating,
        sort: selectedSort
      })
  });

  const ITEMS_PER_PAGE = 9;
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    // Reset to page 1 on filter modification
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const setPage = (pageNumber: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (pageNumber <= 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', pageNumber.toString());
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSearchParams(new URLSearchParams());
  };

  const totalCoursesCount = courses?.length || 0;
  const totalPages = Math.ceil(totalCoursesCount / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCoursesCount);
  const paginatedCourses = courses?.slice(startIndex, endIndex) || [];

  const hasActiveFilters =
    debouncedSearch ||
    selectedCategory !== 'all' ||
    selectedLevel !== 'all' ||
    selectedPrice !== 'all' ||
    selectedRating !== 'all';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Strip */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Course Curriculum
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse world-class technical courses across cloud, distributed systems, full-stack, and artificial intelligence.
          </p>
        </div>

        {/* Search & Mobile Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, topics, concepts..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="popular">Most Popular</option>
                <option value="top_rated">Highest Rated</option>
                <option value="newest">Newest Releases</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                "{debouncedSearch}"
                <button onClick={() => setSearchInput('')} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                Category: {categories?.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                <button onClick={() => updateParam('category', 'all')} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedLevel !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                Level: {selectedLevel}
                <button onClick={() => updateParam('level', 'all')} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPrice !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                Price: {selectedPrice}
                <button onClick={() => updateParam('price', 'all')} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedRating !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                Rating: {selectedRating}+ stars
                <button onClick={() => updateParam('rating', 'all')} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP FILTERS SIDEBAR */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-indigo-500" />
                  Filter Courses
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Category
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => updateParam('category', 'all')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] opacity-60 tabular-nums">({cat.courseCount || 1})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Experience Level
                </label>
                <div className="space-y-1">
                  {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateParam('level', lvl)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                        selectedLevel === lvl
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {lvl === 'all' ? 'All Levels' : lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Pricing
                </label>
                <div className="space-y-1">
                  {[
                    { key: 'all', label: 'All Courses' },
                    { key: 'free', label: 'Free' },
                    { key: 'paid', label: 'Paid' }
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => updateParam('price', p.key)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedPrice === p.key
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-1">
                  {[
                    { key: 'all', label: 'Any Rating' },
                    { key: '4.5', label: '4.5 & up' },
                    { key: '4.0', label: '4.0 & up' },
                    { key: '3.5', label: '3.5 & up' }
                  ].map((r) => (
                    <button
                      key={r.key}
                      onClick={() => updateParam('rating', r.key)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedRating === r.key
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* MAIN RESULTS GRID */}
          <div className="lg:col-span-3">
            
            {/* Results count strip */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span>
                Showing <strong className="text-slate-900 dark:text-white font-mono tabular-nums">
                  {totalCoursesCount > 0 ? `${startIndex + 1}–${endIndex}` : '0'}
                </strong> of <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{totalCoursesCount}</strong> courses
              </span>
              {totalPages > 1 && (
                <span className="text-[11px] font-medium text-slate-400">
                  Page {validCurrentPage} of {totalPages}
                </span>
              )}
            </div>

            {/* Error State */}
            {isError && (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50">
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Unable to load courses. Please try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && courses && courses.length === 0 && (
              <EmptyState
                icon={BookOpen}
                title="No courses matched your query"
                description="Try relaxing your filters, searching for a different keyword, or resetting to view all courses."
                actionText="Reset All Filters"
                onAction={clearAllFilters}
              />
            )}

            {/* Success State */}
            {!isLoading && !isError && paginatedCourses.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Page <span className="font-semibold text-slate-900 dark:text-white">{validCurrentPage}</span> of <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPage(validCurrentPage - 1)}
                        disabled={validCurrentPage <= 1}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                        // Display sliding window of page numbers
                        if (
                          totalPages > 7 &&
                          Math.abs(pageNum - validCurrentPage) > 2 &&
                          pageNum !== 1 &&
                          pageNum !== totalPages
                        ) {
                          if (pageNum === 2 || pageNum === totalPages - 1) {
                            return (
                              <span key={pageNum} className="px-1 text-slate-400 text-xs">
                                …
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-colors ${
                              validCurrentPage === pageNum
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setPage(validCurrentPage + 1)}
                        disabled={validCurrentPage >= totalPages}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => { updateParam('category', 'all'); setMobileFilterOpen(false); }}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded ${selectedCategory === 'all' ? 'font-bold text-indigo-600' : 'text-slate-600'}`}
                >
                  All Categories
                </button>
                {categories?.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { updateParam('category', c.id); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded ${selectedCategory === c.id ? 'font-bold text-indigo-600' : 'text-slate-600'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
                className="w-full py-2 text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
