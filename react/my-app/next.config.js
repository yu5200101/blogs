/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/docs',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'store.sdbao.com',
        port: '',
        pathname: '/**/**',
      },
    ],
  },
}

module.exports = nextConfig
