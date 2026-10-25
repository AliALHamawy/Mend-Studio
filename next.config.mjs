import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  // Output file tracing walks up from the project looking for a lockfile to infer the workspace
  // root. A stray package-lock.json in the parent folder (C:\Users\DELL) is picked up that way and
  // rejected for being outside the Git repository, which prints a warning on every build. Pinning
  // the root to this directory skips the search and keeps tracing scoped to the project.
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  // The FFmpeg WASM packages construct their worker with `new URL(<dynamic>, import.meta.url)`,
  // which Turbopack tries to resolve at build time and fails on. Both `dev` and `build` therefore
  // run on webpack (see package.json scripts), so no `turbopack` options are configured here.
  webpack(config) {
    // @ffmpeg/ffmpeg's worker loads ffmpeg-core with a runtime `import(coreURL)`. Webpack cannot see
    // a request in that expression, so it rewrites the call into a `__webpack_require__` lookup that
    // dies with `Cannot find module 'blob:http://localhost:3000/…'`. The loader marks the import as
    // ignored so it stays a native dynamic import — see scripts/webpack-ffmpeg-worker-ignore.cjs.
    //
    // Scoped to that one file: our own `import("@ffmpeg/ffmpeg")` calls must keep being bundled.
    config.module.rules.push({
      test: /node_modules[\\/]@ffmpeg[\\/]ffmpeg[\\/]dist[\\/]esm[\\/]worker\.js$/,
      use: [
        {
          loader: fileURLToPath(
            new URL('./scripts/webpack-ffmpeg-worker-ignore.cjs', import.meta.url),
          ),
        },
      ],
    });
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // FFmpeg WebAssembly only gets SharedArrayBuffer (and therefore its multithreaded
          // core) inside a cross-origin isolated document.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  }
};

export default nextConfig;
