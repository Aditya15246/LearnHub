const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get Admin Dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalCourses,
      publishedCourses,
      pendingCourses,
      draftCourses,
      rejectedCourses,
      totalEnrollments
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'admin' }),
      Course.countDocuments(),
      Course.countDocuments({ status: 'published' }),
      Course.countDocuments({ status: 'pending' }),
      Course.countDocuments({ status: 'draft' }),
      Course.countDocuments({ status: 'rejected' }),
      Enrollment.countDocuments()
    ]);

    const recentPending = await Course.find({ status: 'pending' })
      .populate('instructorId', 'name email profileImage')
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalUsers: totalStudents + totalTeachers + totalAdmins,
        totalCourses,
        publishedCourses,
        pendingCourses,
        draftCourses,
        rejectedCourses,
        totalEnrollments
      },
      recentPending,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and filter
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.accountStatus = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend or Reactivate a user account
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const targetUserId = req.params.id;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "suspended"'
      });
    }

    // Safety: Admin cannot suspend themselves
    if (req.user._id.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own account status'
      });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Protect another admin from being suspended by an admin if needed
    if (user.role === 'admin' && status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Cannot suspend an administrator account'
      });
    }

    user.accountStatus = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${status === 'suspended' ? 'suspended' : 'reactivated'}`,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses awaiting moderation
// @route   GET /api/admin/courses/pending
// @access  Private (Admin)
const getPendingCourses = async (req, res, next) => {
  try {
    const pendingCourses = await Course.find({ status: 'pending' })
      .populate('instructorId', 'name email profileImage headline')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingCourses.length,
      courses: pendingCourses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve course (Publish)
// @route   PATCH /api/admin/courses/:id/approve
// @access  Private (Admin)
const approveCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructorId',
      'name email'
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.status = 'published';
    course.rejectionReason = '';
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course "${course.title}" has been approved and published`,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject course
// @route   PATCH /api/admin/courses/:id/reject
// @access  Private (Admin)
const rejectCourse = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const course = await Course.findById(req.params.id).populate(
      'instructorId',
      'name email'
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.status = 'rejected';
    course.rejectionReason = reason ? reason.trim() : 'Does not meet curriculum guidelines.';
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course "${course.title}" was rejected`,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unpublish course
// @route   PATCH /api/admin/courses/:id/unpublish
// @access  Private (Admin)
const unpublishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.status = 'draft';
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course "${course.title}" has been unpublished and moved to draft`,
      course
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  unpublishCourse
};
