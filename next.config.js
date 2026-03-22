/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['media.duffleup.in', 'duffleup-media.s3.ap-south-1.amazonaws.com'],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ]},
    ];
  },
};
module.exports = nextConfig;
