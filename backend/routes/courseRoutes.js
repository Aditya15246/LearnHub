const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  submitCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, optionalProtect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.get('/', getCourses);
router.get('/:id', optionalProtect, getCourseById);
router.post('/', protect, authorizeRoles('teacher', 'admin'), createCourse);
router.patch('/:id', protect, authorizeRoles('teacher', 'admin'), updateCourse);
router.patch('/:id/submit', protect, authorizeRoles('teacher'), submitCourse);
router.delete('/:id', protect, authorizeRoles('teacher', 'admin'), deleteCourse);

module.exports = router;
