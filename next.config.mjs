/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "csv-to-markdown-six.vercel.app",
          },
        ],
        destination: "https://www.kouegg.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
