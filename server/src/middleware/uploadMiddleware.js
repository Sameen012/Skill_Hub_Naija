const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

// 1. Configure Local Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in server/uploads/
  },
  filename: (req, file, cb) => {
    // Naming: image-<timestamp>.<extension> (e.g., image-123456789.jpg)
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// 2. Filter Files (Images Only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit size to 5MB
});
module.exports = upload;