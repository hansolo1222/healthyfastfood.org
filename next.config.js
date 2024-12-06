/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,   
  },
  i18n: {
    locales: ["en-US", "de", "uk", "fr", "it", "es", "ca", "au"],
    defaultLocale: "en-US",
  },
  experimental: { esmExternals: true },
  async redirects() {
    return [
      {
        source: '/:restaurant/keto-low-carb',
        destination: '/:restaurant/keto',
        permanent: true,
      },
      {
        source: '/:restaurant/"low-carb"',
        destination: '/:restaurant/low-carb',
        permanent: true,
      },
      {
        source: '/:restaurant/"gluten-free"',
        destination: '/:restaurant/low-carb',
        permanent: true,
      },
      {
        source: '/salsaritas',
        destination: '/salsaritas-fresh-mexican-grill',
        permanent: true,
      },
      {
        source: "/Casey's",
        destination: '/caseys',
        permanent: true,
      },
      {
        source: "/sandellas-flatbread-café",
        destination: '/sandellas-flatbread-cafe',
        permanent: true,
      },
      {
        source: "/chipotle",
        destination: '/chipotle-mexican-grill',
        permanent: true,
      },
      {
        source: "/perkins",
        destination: '/perkins-restaurant-bakery',
        permanent: true,
      },
      {
        source: "/outback",
        destination: '/outback-steakhouse',
        permanent: true,
      },
    ]
  }
}

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })


// module.exports = withBundleAnalyzer({nextConfig})
