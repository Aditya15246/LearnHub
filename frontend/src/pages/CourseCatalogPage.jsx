import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, BookOpen, RotateCcw } from 'lucide-react';
import { courseService } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, LEVELS } from '../utils/constants';

const CourseCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const selectedCategory = searchParams.get('category') || 'All';
  const selectedLevel = searchParams.get('level') || 'All Levels';
  const searchQuery = searchParams.get('search') || '';
  const selectedSort = searchParams.get('sort') || 'newest';

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          level: selectedLevel !== 'All Levels' ? selectedLevel : undefined,
          search: searchQuery || undefined,
          sort: selectedSort
        };

        const data = await courseService.getCourses(params);
        setCourses(data.courses || []);
        setTotal(data.total || 0);
        setTotalPages(data.pages || 1);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, selectedLevel, searchQuery, selectedSort, page]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'All Levels') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.delete('page'); // Reset page
    setPage(1);
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', localSearch.trim());
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedLevel !== 'All Levels' || !!searchQuery;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Explore All Courses</h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover {total} free community and master courses to accelerate your career.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title, keywords or category..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
          </form>

          {/* Level Filter & Sort */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => updateParam('level', e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Sort:</span>
              <select
                value={selectedSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title: A - Z</option>
                <option value="title-desc">Title: Z - A</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => updateParam('category', cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 h-80 animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses matched your query"
          description="Try broadening your search keywords, switching categories, or clearing applied filters."
          action={
            hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition"
              >
                Reset All Filters
              </button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-slate-600 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default CourseCatalogPage;
