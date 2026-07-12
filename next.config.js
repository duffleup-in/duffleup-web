/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.duffleup.in' },
      { protocol: 'https', hostname: 'duffleup-media.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // The brand wordmark is a first-party SVG. Next refuses to run SVGs through
    // the image optimizer unless explicitly allowed; sandbox the response so an
    // SVG can't execute script.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
