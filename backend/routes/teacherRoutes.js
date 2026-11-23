const express = require('express');
const router = express.Router();
const {
  getTeacherDashboard,
  getTeacherCourses
} = require('../controllers/teacherController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.use(protect);
router.use(authorizeRoles('teacher', 'admin'));

router.get('/dashboard', getTeacherDashboard);
router.get('/courses', getTeacherCourses);

module.exports = router;
