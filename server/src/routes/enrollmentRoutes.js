const express = require('express');
const { getMyEnrollments, createEnrollment } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/me', getMyEnrollments);
router.post('/', createEnrollment);

module.exports = router;
