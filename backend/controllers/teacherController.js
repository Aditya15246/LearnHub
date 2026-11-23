const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get teacher dashboard stats and recent courses
// @route   GET /api/teacher/dashboard
// @access  Private (Teacher)
const getTeacherDashboard = async (req, res, next) => {
  try {
    const teacherId = req.user._id;

    // Fetch all courses belonging to this teacher
    const courses = await Course.find({ instructorId: teacherId }).sort({ updatedAt: -1 });

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.status === 'published').length;
    const draftCourses = courses.filter((c) => c.status === 'draft').length;
    const pendingCourses = courses.filter((c) => c.status === 'pending').length;
    const rejectedCourses = courses.filter((c) => c.status === 'rejected').length;

    // Calculate total enrollments across all teacher's courses
    const courseIds = courses.map((c) => c._id);
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });
    const totalEnrollments = enrollments.length;

    // Unique students taught
    const uniqueStudentIds = new Set(enrollments.map((e) => e.studentId.toString()));
    const totalUniqueStudents = uniqueStudentIds.size;

    // Map enrollment counts to courses
    const enrollmentCountsByCourse = {};
    enrollments.forEach((e) => {
      const cId = e.courseId.toString();
      enrollmentCountsByCourse[cId] = (enrollmentCountsByCourse[cId] || 0) + 1;
    });

    const recentCourses = courses.slice(0, 5).map((course) => {
      const cObj = course.toObject();
      cObj.enrollmentCount = enrollmentCountsByCourse[course._id.toString()] || 0;
      return cObj;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        publishedCourses,
        draftCourses,
        pendingCourses,
        rejectedCourses,
        totalEnrollments,
        totalUniqueStudents
      },
      recentCourses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses created by the teacher
// @route   GET /api/teacher/courses
// @access  Private (Teacher)
const getTeacherCourses = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { instructorId: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query).sort({ updatedAt: -1 });

    const courseIds = courses.map((c) => c._id);
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    enrollmentCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const enrichedCourses = courses.map((c) => {
      const cObj = c.toObject();
      cObj.enrollmentCount = countMap[c._id.toString()] || 0;
      return cObj;
    });

    res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      courses: enrichedCourses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeacherDashboard,
  getTeacherCourses
};
