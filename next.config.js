const withOffline = require('next-offline');
const { locales, defaultLocale } = require('./i18n.json');
const { API_URL, BACKEND_URL, FRONTEND_URL, SA_URL } = process.env;

const config = {
  target: 'server',
  env: {
    API_URL,
    BACKEND_URL: BACKEND_URL || API_URL, // In prod these are the same, so we only define the first one.
    FRONTEND_URL,
    SA_URL,
  },
  typescript: {
    ignoreDevErrors: true,
  },
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  },
  rewrites: async () => [
    {
      source: '/service-worker.js',
      destination: '/_next/static/service-worker.js',
    },
  ],
  i18n: {
    locales,
    defaultLocale,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
    });

    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    return config;
  },
};

module.exports = withOffline(config);
