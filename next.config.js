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
  // 移除无效的experimental配置
  experimental: {
    // 这些选项在Next.js 15中不再有效
    // appDir: true,
    // serverComponents: false,
  },
}

module.exports = nextConfig
