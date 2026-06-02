const pool = require('../config/db.js');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const [courses] = await pool.query('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get single course with modules
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    // 1. Get Course Details
    const [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courses[0];

    // 2. Get Modules for this course
    const [modules] = await pool.query('SELECT * FROM modules WHERE course_id = ?', [req.params.id]);

    // 3. Return combined data
    res.json({ ...course, modules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getCourses,
  getCourseById,
};