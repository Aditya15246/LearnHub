import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Compass,
  Star,
  Layers,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { courseService } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import { CATEGORIES } from '../utils/constants';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeCourses = async () => {
      try {
        const data = await courseService.getCourses({ limit: 8 });
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching home courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredCourses = courses.slice(0, 4);
  const recentCourses = courses.slice(4, 8);

  const stats = [
    { label: 'Active Learners', value: '10,000+', icon: Users },
    { label: 'Curated Courses', value: '50+', icon: BookOpen },
    { label: 'Verified Instructors', value: '15+', icon: Award },
    { label: 'Free Access Rate', value: '100%', icon: Sparkles }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Online Learning Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
              Master in-demand skills with <span className="text-brand-600">expert-led</span> courses.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover video courses taught by industry veterans. Learn at your own pace, track your progress, and build portfolio-ready skills — 100% free.
            </p>

            {/* Hero Search Box */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl shadow-lg border border-slate-200/80">
                <div className="flex items-center flex-1 w-full pl-3 gap-2">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by topic, skill, or framework (e.g. React, Docker...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Popular Tags */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500 pt-2">
              <span className="font-semibold text-slate-700">Popular:</span>
              {['Development', 'Design', 'Data Science', 'DevOps'].map((cat) => (
                <Link
                  key={cat}
                  to={`/courses?category=${encodeURIComponent(cat)}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  {cat}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-2">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-navy-900">{s.value}</h4>
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Staff Picks & Trending</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Featured Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Categories Grid */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Pick a domain and dive into structured curricula built by seasoned practitioners.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORIES.filter((c) => c !== 'All').map((category) => (
              <Link
                key={category}
                to={`/courses?category=${encodeURIComponent(category)}`}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition">
                  {category}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Browse curricula →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Courses */}
      {recentCourses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Fresh Content</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                Recently Added Courses
              </h2>
            </div>
            <Link
              to="/courses?sort=newest"
              className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition"
            >
              <span>See New Releases</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Become an Instructor CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              Instructor Community
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Share your knowledge. Become an instructor on LearnHub.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Design curricula, organize video lessons into clean sections, submit your course for swift moderation, and inspire students worldwide.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/register?role=teacher"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold shadow-md transition"
              >
                Start Teaching Today
              </Link>
              <Link
                to="/courses"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition"
              >
                Browse Student Experience
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
