# Junie Lite - Backend Development Agent Guidelines

## Project Context
You are working on the backend migration for a media conversion web application. 
- Current state: The frontend is fully functional on Next.js, handling client-side conversions via FFmpeg WASM (with a custom Webpack loader workaround).
- Goal: Build a dedicated Node.js & Express backend to handle heavy media conversions (audio/video) to bypass mobile browser memory limitations and allow server-side processing, intended for deployment on Hostinger.

## Tech Stack
- Runtime: Node.js
- Framework: Express.js
- Core Processing: `fluent-ffmpeg` or native `child_process` with installed `ffmpeg` binaries.
- File Management: Multer (for handling incoming media uploads) and temporary local storage management.

## Core Rules & Constraints
1. **Never alter frontend configuration or working client-side code** unless explicitly requested.
2. Keep the backend modular, clean, and production-ready for a VPS environment (Hostinger).
3. Implement proper error handling, file cleanup (deleting temp files after processing), and clear API response contracts.
4. All code snippets, technical comments, and error messages must be written strictly in **English**.