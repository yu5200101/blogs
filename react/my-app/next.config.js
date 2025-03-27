/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/docs',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'store.test.com',
        port: '',
        pathname: '/**/**',
      },
    ],
  },
}

module.exports = nextConfig
