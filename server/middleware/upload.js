const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Define allowed file types
const allowedMimeTypes = [
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/aac',
  'audio/ogg',
  'audio/flac',
  'audio/webm',
  'audio/x-ms-wma',
  'audio/x-wav',
  // Video
  'video/mp4',
  'video/mpeg',
  'video/avi',
  'video/x-msvideo',
  'video/webm',
  'video/quicktime',
  'video/x-ms-wmv',
  'video/x-matroska',
  'video/x-flv'
];

// Define allowed file extensions
const allowedExtensions = [
  // Audio
  '.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.webm', '.wma',
  // Video
  '.mp4', '.avi', '.mov', '.wmv', '.mkv', '.flv', '.webm', '.m4v'
];

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'temp', 'uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to avoid collisions
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Check MIME type
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (allowedExtensions.includes(ext)) {
    // Allow if extension matches even if MIME type is not recognized
    cb(null, true);
  } else {
    cb(new Error(`File type not supported: ${file.mimetype}. Allowed types: ${allowedExtensions.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max file size
  }
});

module.exports = upload;
