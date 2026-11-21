const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: '10 min'
  },
  order: {
    type: Number,
    default: 1
  }
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Section title is required'],
    trim: true
  },
  order: {
    type: Number,
    default: 1
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Course must belong to an instructor']
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels'
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
    },
    learningObjectives: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    sections: [sectionSchema],
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'draft'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total lesson count
courseSchema.virtual('totalLessons').get(function () {
  if (!this.sections) return 0;
  return this.sections.reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0);
});

// Indexes for performance and filtering
courseSchema.index({ status: 1, category: 1 });
courseSchema.index({ instructorId: 1 });
courseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);
