/** @type {import('next').NextConfig} */
const nextConfig = {
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
