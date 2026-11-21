# LearnHub — Scalable E-Learning Platform

LearnHub is a full-stack, modular monolithic e-learning marketplace inspired by Udemy and Coursera. It provides a complete educational lifecycle: teachers design and publish curricula, administrators review and moderate submissions, and students discover, enroll in, and track video-based educational content.

---

## 🏗️ Architectural Overview

LearnHub is architected as a **modular monolith** using the MERN stack with strict separation of concerns:

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express.js REST API, Mongoose ODM, JSON Web Tokens (JWT), bcrypt password hashing.
- **Database**: MongoDB with automatic embedded in-memory fallback (`mongodb-memory-server`) if external MongoDB is not provided, allowing instant zero-configuration local execution.

```
learnhub/
├── backend/
│   ├── config/          # MongoDB connection handler & fallback
│   ├── controllers/     # Business logic for Auth, Courses, Enrollments, Teacher, Admin
│   ├── middleware/      # JWT Protect, Role RBAC, Centralized Error Handling
│   ├── models/          # Mongoose Schemas (User, Course, Enrollment)
│   ├── routes/          # Express route definitions
│   ├── utils/           # JWT helpers, seed script, automated workflow tests
│   ├── server.js        # Server bootstrap & auto-seeder
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, CourseCard, ProgressBar, StatusBadge, Modal, EmptyState
│   │   ├── context/     # AuthContext (session, token, role helpers)
│   │   ├── hooks/       # useAuth hook
│   │   ├── layouts/     # MainLayout, DashboardLayout
│   │   ├── pages/       # Home, Catalog, Details, Login, Register, Student, Teacher, Admin
│   │   ├── services/    # Centralized Axios API client & modular services
│   │   └── utils/       # Constants, categories, levels, demo credentials
│   ├── vite.config.js   # Vite configuration with proxy to port 5001
│   ├── tailwind.config.js
│   └── package.json
│
├── start-dev.js         # Unified development launcher (starts backend + frontend)
├── package.json         # Root scripts orchestrator
└── README.md
```

---

## 👥 User Roles & Access Control

| Role | Permissions & Capabilities |
| :--- | :--- |
| **Student** | Browse course marketplace, search & filter by category/level, enroll in free courses, stream video lectures, mark lessons complete/incomplete, track percentage progress, continue learning from dashboard. |
| **Teacher** | Create draft courses, define modules and video lessons, edit existing curricula, submit courses for administrative review, track total enrollments, view moderation feedback if rejected. Cannot edit courses owned by other teachers. |
| **Admin** | Access platform moderation dashboard, inspect submitted courses, approve and publish courses, reject courses with feedback reasons, unpublish courses, view user registry, suspend or reactivate user accounts. |

---

## ⚡ Default Seed Accounts & Credentials

The platform comes pre-seeded with realistic data (Password for all accounts: `Password123!`):

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | Eleanor Vance | `admin@learnhub.com` | `Password123!` |
| 👨‍🏫 **Teacher 1** | Dr. Marcus Sterling | `marcus.sterling@learnhub.com` | `Password123!` |
| 👩‍🏫 **Teacher 2** | Sarah Jenkins | `sarah.jenkins@learnhub.com` | `Password123!` |
| 🎓 **Student 1** | Alex Rivera | `alex.rivera@learnhub.com` | `Password123!` |
| 🎓 **Student 2** | Chloe Chen | `chloe.chen@learnhub.com` | `Password123!` |

> **Tip:** The Login page includes **1-Click Quick Fill** demo buttons for instant testing.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

From the project root:
```bash
npm run install:all
```
*(Or install in `backend` and `frontend` separately)*

### 2. Start Both Backend & Frontend

```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5001](http://localhost:5001)
- **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

*(The backend will auto-seed realistic courses and accounts on initial launch if empty)*

---

## 🧪 Automated End-to-End Workflow Verification

A test suite verifying all 11 required system workflows is included in `backend/utils/test-workflows.js`.

Run the automated tests:
```bash
node backend/utils/test-workflows.js
```

### Verified Workflows:
1. Student registration & login.
2. Teacher course creation & submission for approval.
3. Admin moderation queue, course rejection with reasons, re-submission, and course approval.
4. Marketplace isolation (only published courses appear in public catalog).
5. Student free enrollment in published courses.
6. Enrolled student access to lessons and curriculum.
7. Interactive lesson completion and progress percentage calculation.
8. Persistence of progress after logout and login.
9. Multi-tenant teacher ownership guard (teacher cannot edit another teacher's course).
10. Role-based endpoint guards (students forbidden from teacher & admin APIs).
11. Security privilege protection (public registration cannot request admin role; profile update cannot alter role).

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register student or teacher account
- `POST /api/auth/login` — Login & receive JWT token
- `POST /api/auth/logout` — Logout session
- `GET /api/auth/me` — Get authenticated user details (Protected)
- `PATCH /api/auth/profile` — Update user profile (Protected)

### Courses (`/api/courses`)
- `GET /api/courses` — Public marketplace with search, category, level & sort
- `GET /api/courses/:id` — Get course details & curriculum
- `POST /api/courses` — Create new course as draft (Teacher)
- `PATCH /api/courses/:id` — Update course details (Teacher owner / Admin)
- `PATCH /api/courses/:id/submit` — Submit course for admin approval (Teacher owner)
- `DELETE /api/courses/:id` — Delete draft course (Teacher owner / Admin)

### Enrollments (`/api/enrollments`)
- `POST /api/enrollments` — Enroll in a published course (Student)
- `GET /api/enrollments/my-courses` — Student dashboard enrolled courses & progress
- `GET /api/enrollments/:courseId` — Learning player curriculum & progress state
- `PATCH /api/enrollments/:courseId/progress` — Toggle lesson complete & recalculate %

### Instructor Studio (`/api/teacher`)
- `GET /api/teacher/dashboard` — Teacher metrics, course counts & student totals
- `GET /api/teacher/courses` — List all courses owned by logged-in instructor

### Admin Moderation (`/api/admin`)
- `GET /api/admin/dashboard` — System-wide platform metrics
- `GET /api/admin/users` — Directory of users with search, role & status filters
- `PATCH /api/admin/users/:id/status` — Suspend or reactivate user accounts
- `GET /api/admin/courses/pending` — Courses awaiting administrative moderation
- `PATCH /api/admin/courses/:id/approve` — Approve & publish course
- `PATCH /api/admin/courses/:id/reject` — Reject course with feedback reason
- `PATCH /api/admin/courses/:id/unpublish` — Move course back to draft
