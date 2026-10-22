/**
 * Injects a `webpackIgnore` magic comment into @ffmpeg/ffmpeg's worker so webpack leaves the
 * worker's dynamic import alone.
 *
 * The worker loads ffmpeg-core with `await import(coreURL)`, where `coreURL` only exists at runtime
 * (it is a `blob:` URL). A request webpack cannot see statically is rewritten into a
 * `__webpack_require__` lookup, which fails at runtime with:
 *
 *   Cannot find module 'blob:http://localhost:3000/…'
 *
 * `webpackIgnore: true` is the documented escape hatch for exactly this, but it has to sit inside
 * the `import()` of the file doing the importing — and that file ships inside the dependency — so
 * this loader puts it there. The marker it keys off is the `@vite-ignore` comment the package
 * already carries for the same purpose, which keeps the rewrite anchored to the real call instead
 * of guessing at its formatting.
 *
 * Wired up by the `webpack()` function in next.config.mjs. If a future @ffmpeg/ffmpeg drops the
 * marker, the source is returned untouched.
 */
const MARKER = "/* @vite-ignore */";

module.exports = function webpackFfmpegWorkerIgnore(source) {
  if (!source.includes(MARKER)) return source;
  return source.replace(MARKER, `${MARKER} /* webpackIgnore: true */`);
};
