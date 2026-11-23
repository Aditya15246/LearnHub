import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Users, Award } from 'lucide-react';

const CourseCard = ({ course }) => {
  if (!course) return null;

  const totalLessons = course.sections
    ? course.sections.reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0)
    : course.totalLessons || 0;

  const instructorName = course.instructorId?.name || 'LearnHub Instructor';
  const instructorImg = course.instructorId?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=e0e7ff&color=4f46e5`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col group">
      {/* Thumbnail */}
      <Link to={`/courses/${course._id}`} className="relative aspect-video overflow-hidden bg-slate-100 block">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/95 text-navy-900 rounded-full shadow-sm backdrop-blur-sm">
            {course.category}
          </span>
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-brand-600 text-white rounded-full shadow-sm">
            {course.level}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-full shadow-sm">
            FREE
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/courses/${course._id}`}>
            <h3 className="font-bold text-base text-navy-900 line-clamp-2 group-hover:text-brand-600 transition">
              {course.title}
            </h3>
          </Link>
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Instructor & Meta */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <img
              src={instructorImg}
              alt={instructorName}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-medium text-slate-700 truncate">{instructorName}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{totalLessons} lessons</span>
            </div>
            {course.enrollmentCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{course.enrollmentCount} enrolled</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
