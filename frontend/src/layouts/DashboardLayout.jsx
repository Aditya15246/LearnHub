import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  CheckSquare, 
  LogOut, 
  Compass, 
  Menu, 
  X,
  UserCheck,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout, isStudent, isTeacher, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Define role-specific navigation items
  let navItems = [];
  let dashboardTitle = 'Dashboard';

  if (isStudent) {
    dashboardTitle = 'Student Portal';
    navItems = [
      { name: 'My Learning', path: '/student/dashboard', icon: BookOpen },
      { name: 'Browse Marketplace', path: '/courses', icon: Compass }
    ];
  } else if (isTeacher) {
    dashboardTitle = 'Instructor Studio';
    navItems = [
      { name: 'Dashboard Overview', path: '/teacher/dashboard', icon: LayoutDashboard },
      { name: 'Create New Course', path: '/teacher/courses/new', icon: PlusCircle },
      { name: 'Public Marketplace', path: '/courses', icon: Compass }
    ];
  } else if (isAdmin) {
    dashboardTitle = 'Admin Moderation';
    navItems = [
      { name: 'Platform Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Course Moderation', path: '/admin/courses', icon: CheckSquare },
      { name: 'Public Marketplace', path: '/courses', icon: Compass }
    ];
  }

  const roleBadgeColor = {
    admin: 'bg-rose-100 text-rose-700 border-rose-200',
    teacher: 'bg-brand-100 text-brand-700 border-brand-200',
    student: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }[user?.role] || 'bg-slate-100 text-slate-700';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Link to="/" className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </Link>
          <span className="font-bold text-navy-900 text-sm">{dashboardTitle}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-white border-r border-slate-200 w-64 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-navy-900 tracking-tight">LearnHub</span>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{dashboardTitle}</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Preview */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <img
                src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-navy-900 truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleBadgeColor}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
