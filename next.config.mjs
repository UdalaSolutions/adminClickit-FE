import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A stray package-lock.json in the home folder makes Next guess the wrong
  // workspace root. Pin it to this project.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://clickit-backend-ctxu.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
