const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all published courses (Marketplace)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { search, category, level, sort, page = 1, limit = 12 } = req.query;

    const query = { status: 'published' };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Level filter
    if (level && level !== 'All Levels' && level !== 'all') {
      query.level = level;
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'title-asc') {
      sortOptions = { title: 1 };
    } else if (sort === 'title-desc') {
      sortOptions = { title: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructorId', 'name email profileImage headline')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get enrollment count for each course
    const courseIds = courses.map((c) => c._id);
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    enrollmentCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const enrichedCourses = courses.map((course) => {
      const cObj = course.toObject();
      cObj.enrollmentCount = countMap[course._id.toString()] || 0;
      return cObj;
    });

    res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      courses: enrichedCourses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public (Published courses) / Private (Draft/Pending for Owner or Admin)
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructorId',
      'name email profileImage headline bio'
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // If course is not published, only instructor owner or admin can view
    if (course.status !== 'published') {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: 'This course is currently not published'
        });
      }

      const isOwner = req.user._id.toString() === course.instructorId._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view this unpublished course'
        });
      }
    }

    const cObj = course.toObject();
    const enrollmentCount = await Enrollment.countDocuments({ courseId: course._id });
    cObj.enrollmentCount = enrollmentCount;

    res.status(200).json({
      success: true,
      course: cObj
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course (Teacher only)
// @route   POST /api/courses
// @access  Private (Teacher)
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      level,
      thumbnail,
      learningObjectives,
      requirements,
      sections
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course title, description, and category'
      });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      level: level || 'All Levels',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      learningObjectives: learningObjectives || [],
      requirements: requirements || [],
      sections: sections || [],
      instructorId: req.user._id,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully as draft',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (Teacher owner or Admin)
// @route   PATCH /api/courses/:id
// @access  Private (Teacher owner or Admin)
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    const isOwner = req.user._id.toString() === course.instructorId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify another teacher\'s course'
      });
    }

    const {
      title,
      description,
      category,
      level,
      thumbnail,
      learningObjectives,
      requirements,
      sections,
      status
    } = req.body;

    if (title !== undefined) course.title = title.trim();
    if (description !== undefined) course.description = description.trim();
    if (category !== undefined) course.category = category.trim();
    if (level !== undefined) course.level = level;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (learningObjectives !== undefined) course.learningObjectives = learningObjectives;
    if (requirements !== undefined) course.requirements = requirements;
    if (sections !== undefined) course.sections = sections;

    // Status management: Teacher can toggle draft or submit for approval
    if (status && !isAdmin) {
      if (['draft', 'pending'].includes(status)) {
        course.status = status;
      }
    } else if (status && isAdmin) {
      course.status = status;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit course for admin approval
// @route   PATCH /api/courses/:id/submit
// @access  Private (Teacher owner)
const submitCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this course'
      });
    }

    // Validate that course has minimum content
    if (!course.sections || course.sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot submit a course without at least one section'
      });
    }

    const totalLessons = course.sections.reduce(
      (acc, s) => acc + (s.lessons ? s.lessons.length : 0),
      0
    );

    if (totalLessons === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot submit a course without at least one lesson'
      });
    }

    course.status = 'pending';
    course.rejectionReason = ''; // Clear prior rejection reason if any
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course submitted successfully for admin review',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (Teacher owner or Admin)
// @route   DELETE /api/courses/:id
// @access  Private (Teacher owner or Admin)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const isOwner = req.user._id.toString() === course.instructorId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    // Delete enrollments associated with this course
    await Enrollment.deleteMany({ courseId: course._id });
    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course and related enrollments deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  submitCourse,
  deleteCourse
};
