const pool = require('../config/db.js');

// @desc    Get enrollments for current user or all enrollments
// @route   GET /api/enrollments
const getEnrollments = async (req, res) => {
  try {
    const { userId, courseId } = req.query;
    const conditions = [];
    const values = [];

    if (userId) {
      conditions.push('user_id = ?');
      values.push(userId);
    }
    if (courseId) {
      conditions.push('course_id = ?');
      values.push(courseId);
    }

    const query = `SELECT * FROM enrollments${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''}`;
    const [enrollments] = await pool.query(query, values);

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Enroll current user in a course
// @route   POST /api/enrollments
const createEnrollment = async (req, res) => {
  const userId = req.user?.id;
  const { course_id } = req.body;

  if (!userId || !course_id) {
    return res.status(400).json({ error: 'User ID and course ID are required' });
  }

  try {
    const [existingCourse] = await pool.query('SELECT id FROM courses WHERE id = ?', [course_id]);
    if (!existingCourse.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const [existing] = await pool.query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, course_id]
    );

    if (existing.length) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const completedModules = JSON.stringify([]);
    await pool.query(
      'INSERT INTO enrollments (user_id, course_id, progress, completed_modules) VALUES (?, ?, ?, ?)',
      [userId, course_id, 0, completedModules]
    );

    res.status(201).json({
      user_id: userId,
      course_id,
      progress: 0,
      completed_modules: [],
      enrolled_at: new Date(),
    });
  } catch (error) {
    console.error('Create enrollment error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete the user's enrollment for a course
// @route   DELETE /api/enrollments/:courseId
const deleteEnrollment = async (req, res) => {
  const userId = req.user?.id;
  const { courseId } = req.params;

  if (!userId || !courseId) {
    return res.status(400).json({ error: 'User ID and course ID are required' });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json({ message: 'Enrollment removed' });
  } catch (error) {
    console.error('Delete enrollment error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
};
