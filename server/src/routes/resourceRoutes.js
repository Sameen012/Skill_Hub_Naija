const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/resourceUploadMiddleware');
const {
  getResources,
  createResource,
  downloadResource,
  deleteResource,
} = require('../controllers/resourceController');

const router = express.Router();

router.get('/', getResources);
router.get('/:id/download', downloadResource);
router.post('/', protect, authorizeRoles('admin'), upload.single('file'), createResource);
router.delete('/:id', protect, authorizeRoles('admin'), deleteResource);

module.exports = router;