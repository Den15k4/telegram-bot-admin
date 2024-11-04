// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          // Разрешаем CORS для API
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          ],
        },
      ]
    },
  }
  
  module.exports = nextConfig