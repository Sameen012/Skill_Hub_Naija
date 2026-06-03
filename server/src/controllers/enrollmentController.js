const pool = require('../config/db.js');

// @desc    Get logged-in user's enrolled course IDs
// @route   GET /api/enrollments/me
const getMyEnrollments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT course_id FROM enrollments WHERE user_id = ?', [req.user.id]);
    const enrolledCourseIds = rows.map((row) => row.course_id);
    res.json(enrolledCourseIds);
  } catch (error) {
    console.error('Get enrollments error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Enroll logged-in user in a course
// @route   POST /api/enrollments
const createEnrollment = async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'courseId is required' });
  }

  try {
    const [courseRows] = await pool.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (courseRows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const [existing] = await pool.query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [req.user.id, courseId]
    );

    if (existing.length > 0) {
      return res.status(200).json({ message: 'Already enrolled', courseId });
    }

    await pool.query(
      'INSERT INTO enrollments (user_id, course_id, progress, completed_modules) VALUES (?, ?, 0, ?)',
      [req.user.id, courseId, JSON.stringify([])]
    );

    res.status(201).json({ message: 'Enrolled successfully', courseId });
  } catch (error) {
    console.error('Create enrollment error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getMyEnrollments,
  createEnrollment,
};
