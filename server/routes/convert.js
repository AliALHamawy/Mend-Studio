const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { convertMedia, supportedFormats } = require('../controllers/convertController');

/**
 * POST /api/convert
 * Convert an uploaded media file to the specified format.
 * 
 * Request:
 * - multipart/form-data with:
 *   - "file": The media file to convert
 *   - "format": Target format (e.g., "mp3", "mp4", "wav", etc.)
 * 
 * Response:
 * - Success: Downloadable converted file (application/octet-stream)
 * - Error: JSON error message
 */
router.post('/convert', upload.single('file'), convertMedia);

/**
 * GET /api/formats
 * Return supported conversion formats.
 */
router.get('/formats', (req, res) => {
  res.json({
    audio: supportedFormats.audio,
    video: supportedFormats.video
  });
});

module.exports = router;
