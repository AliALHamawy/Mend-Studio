/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  turbopack: {
    root: process.cwd()
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
