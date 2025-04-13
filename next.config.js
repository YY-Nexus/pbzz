/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "export", // 启用静态导出
  images: {
    unoptimized: true, // 静态导出需要禁用图片优化
  },
  // 禁用服务器组件和API路由
  experimental: {
    appDir: true,
    serverComponents: false,
  },
}

module.exports = nextConfig
