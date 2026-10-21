/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  serverExternalPackages: ["ffmpeg-static"],
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
