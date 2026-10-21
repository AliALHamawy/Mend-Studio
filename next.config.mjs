/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  // The FFmpeg WASM packages construct their worker with `new URL(<dynamic>, import.meta.url)`,
  // which Turbopack tries to resolve at build time and fails on. Both `dev` and `build` therefore
  // run on webpack (see package.json scripts), so no `turbopack` options are configured here.
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
