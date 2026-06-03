const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');

const router = express.Router();

router.get('/', protect, getEnrollments);
router.post('/', protect, createEnrollment);
router.delete('/:courseId', protect, deleteEnrollment);

module.exports = router;
