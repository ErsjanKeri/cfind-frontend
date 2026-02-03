/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    unoptimized: true,
  },

  experimental: {
    serverActions: {
      // CRITICAL: Maximum payload size for server actions (FormData including files)
      // Used for agent registration with document uploads (2 files up to 50MB each)
      // IMPORTANT: Server MUST be restarted after changing this value
      bodySizeLimit: '100mb',
    },
  },
}

export default nextConfig
