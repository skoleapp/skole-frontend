const withOffline = require('next-offline');
const withTranslate = require('next-translate');
const R = require('ramda');
const { API_URL, BACKEND_URL, FRONTEND_URL, SA_URL, EMAIL_ADDRESS } = process.env;

const config = {
  target: 'server',
  env: {
    API_URL,
    BACKEND_URL: BACKEND_URL || API_URL, // In prod these are the same, so we only define the first one.
    FRONTEND_URL,
    SA_URL,
    EMAIL_ADDRESS,
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

    // Fixes NPM packages that depend on `fs` module: https://github.com/vercel/next.js/issues/7755#issuecomment-508633125
    if (!options.isServer) {
      config.node = {
        fs: 'empty',
      };
    }

    return config;
  },
};

const withWrappers = R.compose(withOffline, withTranslate);

module.exports = withWrappers(config);
