const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  unpublishCourse
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/courses/pending', getPendingCourses);
router.patch('/courses/:id/approve', approveCourse);
router.patch('/courses/:id/reject', rejectCourse);
router.patch('/courses/:id/unpublish', unpublishCourse);

module.exports = router;