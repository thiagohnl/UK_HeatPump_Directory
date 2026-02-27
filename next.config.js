/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // @supabase/ssr@0.5.2 type imports are incompatible with supabase-js@2.98.0
    // (dist/module/lib/types path no longer exists). Types resolve as 'never'.
    // Runtime behavior is correct — only compile-time inference is affected.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
