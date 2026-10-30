const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Supported output formats
const supportedFormats = {
  audio: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma'],
  video: ['mp4', 'avi', 'mkv', 'webm', 'mov', 'flv', 'wmv']
};

/**
 * Maps logical format names to FFmpeg's internal muxer names.
 * Some formats (mkv, m4a, aac) are not valid FFmpeg muxer identifiers on their own.
 */
const FORMAT_TO_MUXER = {
  aac: 'adts',
  m4a: 'ipod',
  mkv: 'matroska',
  mp3: 'mp3',
  wav: 'wav',
  ogg: 'ogg',
  flac: 'flac',
  wma: 'wma',
  mp4: 'mp4',
  avi: 'avi',
  webm: 'webm',
  mov: 'mov',
  flv: 'flv',
  wmv: 'wmv',
};

/**
 * Maps audio output formats to their explicit FFmpeg audio codecs.
 * Setting the codec prevents FFmpeg from falling back to a slower or incompatible default.
 */
const AUDIO_CODEC_BY_FORMAT = {
  aac: 'aac',
  m4a: 'aac',
  flac: 'flac',
  mp3: 'libmp3lame',
  ogg: 'libvorbis',
  wav: 'pcm_s16le',
  wma: 'wmav2',
};

/** Audio formats that are lossless and should not have a bitrate forced. */
const LOSSLESS_AUDIO_FORMATS = new Set(['flac', 'wav']);

/**
 * Clean up temporary files (both input and output)
 * @param {string} inputPath - Path to the uploaded input file
 * @param {string} outputPath - Path to the converted output file
 */
function cleanupTempFiles(inputPath, outputPath) {
  try {
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
      console.log(`[Cleanup] Deleted input file: ${path.basename(inputPath)}`);
    }
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
      console.log(`[Cleanup] Deleted output file: ${path.basename(outputPath)}`);
    }
  } catch (err) {
    console.error('[Cleanup] Error deleting temp files:', err.message);
  }
}

/**
 * Determine if the file is audio or video based on MIME type
 * @param {string} mimeType - MIME type of the file
 * @returns {string} 'audio', 'video', or 'unknown'
 */
function detectMediaType(mimeType) {
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  return 'unknown';
}

/**
 * Convert media file using FFmpeg
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function convertMedia(req, res) {
  const inputPath = req.file.path;
  const originalName = req.file.originalname;
  const targetFormat = (req.body.format || '').toLowerCase();

  // Validate target format
  if (!targetFormat) {
    cleanupTempFiles(inputPath, null);
    return res.status(400).json({ error: 'Target format is required. Use "format" field in request body.' });
  }

  const mediaType = detectMediaType(req.file.mimetype);
  if (mediaType === 'unknown') {
    cleanupTempFiles(inputPath, null);
    return res.status(400).json({ error: 'Unable to detect media type of the uploaded file.' });
  }

  const allowedFormats = supportedFormats[mediaType];
  if (!allowedFormats.includes(targetFormat)) {
    cleanupTempFiles(inputPath, null);
    return res.status(400).json({
      error: `Unsupported format for ${mediaType} conversion.`,
      supportedFormats: allowedFormats
    });
  }

  // Generate output filename
  const outputDir = path.join(__dirname, '..', 'temp', 'outputs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFilename = `${path.parse(originalName).name}_converted.${targetFormat}`;
  const outputPath = path.join(outputDir, outputFilename);

  console.log(`[Conversion] Starting ${mediaType} conversion: ${originalName} -> ${outputFilename}`);

  // Resolve the FFmpeg muxer name for the target format
  const muxer = FORMAT_TO_MUXER[targetFormat] || targetFormat;

  // Build explicit codec and format options
  const outputOptions = ['-y']; // Overwrite output file if it exists

  if (mediaType === 'audio') {
    // Use explicit audio codec
    const audioCodec = AUDIO_CODEC_BY_FORMAT[targetFormat];
    if (audioCodec) {
      outputOptions.push('-c:a', audioCodec);
    }
    // Apply bitrate for lossy formats (skip for lossless: flac, wav)
    if (!LOSSLESS_AUDIO_FORMATS.has(targetFormat)) {
      outputOptions.push('-b:a', '192k');
    }
  } else {
    // Video encoding with explicit codecs
    if (targetFormat === 'webm') {
      // WebM uses VP9 video + Opus audio
      outputOptions.push('-c:v', 'libvpx-vp9', '-deadline', 'realtime', '-c:a', 'libopus', '-b:a', '96k');
    } else if (targetFormat === 'avi') {
      // AVI uses MPEG-4 video + MP3 audio
      outputOptions.push('-c:v', 'mpeg4', '-q:v', '6', '-c:a', 'mp3', '-b:a', '192k');
    } else {
      // MP4, MKV, MOV, FLV, WMV use H.264 video + AAC audio
      outputOptions.push('-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'aac', '-b:a', '128k');
    }
  }

  // Set the explicit output format (muxer)
  outputOptions.push('-f', muxer);

  console.log(`[Conversion] FFmpeg options:`, outputOptions.join(' '));

  // Set up FFmpeg command with explicit options instead of .toFormat()
  const ffmpegCommand = ffmpeg(inputPath)
    .outputOptions(outputOptions)
    .on('error', (err) => {
      console.error(`[Conversion] FFmpeg error:`, err.message);
      cleanupTempFiles(inputPath, outputPath);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Conversion failed. FFmpeg encountered an error.', details: err.message });
      }
    })
    .on('end', () => {
      console.log(`[Conversion] Conversion completed: ${outputFilename}`);
    })
    .on('progress', (progress) => {
      if (progress.percent) {
        console.log(`[Conversion] Progress: ${progress.percent.toFixed(2)}%`);
      }
    })
    .save(outputPath);

  // Wait for conversion to complete
  try {
    await new Promise((resolve, reject) => {
      ffmpegCommand.on('error', reject);
      ffmpegCommand.on('end', resolve);
    });

    // Verify output file exists
    if (!fs.existsSync(outputPath)) {
      cleanupTempFiles(inputPath, null);
      return res.status(500).json({ error: 'Conversion completed but output file was not created.' });
    }

    // Get file size for response
    const stats = fs.statSync(outputPath);
    const fileSize = stats.size;

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.setHeader('Content-Length', fileSize);

    // Clean up input file immediately before sending response
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
      console.log(`[Cleanup] Deleted input file before response: ${path.basename(inputPath)}`);
    }

    // Stream the output file to the client
    const fileStream = fs.createReadStream(outputPath);

    // Clean up output file after streaming completes
    fileStream.on('end', () => {
      cleanupTempFiles(null, outputPath);
    });
    fileStream.on('error', (err) => {
      console.error('[Stream] Error sending file:', err.message);
      cleanupTempFiles(null, outputPath);
    });

    fileStream.pipe(res);

  } catch (err) {
    console.error('[Conversion] Promise error:', err.message);
    cleanupTempFiles(inputPath, outputPath);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Conversion process failed.', details: err.message });
    }
  }
}

module.exports = {
  convertMedia,
  supportedFormats
};
