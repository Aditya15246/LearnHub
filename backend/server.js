require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const seedData = require('./utils/seed');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'LearnHub',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Start server
const startServer = async () => {
  await connectDB();

  // Auto-seed if database is empty
  try {
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    if (userCount === 0 || courseCount === 0) {
      console.log('Database appears empty. Auto-seeding initial courses and accounts...');
      await seedData();
    }
  } catch (err) {
    console.warn('Auto-seed check failed or skipped:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 LearnHub API Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
