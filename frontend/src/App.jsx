import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboardPage from './pages/StudentDashboardPage';
import LearningPage from './pages/LearningPage';

// Teacher Pages
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import CourseEditorPage from './pages/CourseEditorPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';

function App() {
  return (
    <Routes>
      {/* Public Pages with Main Navbar & Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseCatalogPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Dedicated Learning Player Interface (Full Screen) */}
      <Route
        path="/student/learn/:courseId"
        element={
          <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
            <LearningPage />
          </ProtectedRoute>
        }
      />

      {/* Student Portal (Dashboard Layout) */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
      </Route>

      {/* Teacher Portal (Dashboard Layout) */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboardPage />} />
        <Route path="courses/new" element={<CourseEditorPage />} />
        <Route path="courses/:id/edit" element={<CourseEditorPage />} />
      </Route>

      {/* Admin Portal (Dashboard Layout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
