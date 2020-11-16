const withOffline = require('next-offline');
const { locales, defaultLocale } = require('./i18n.json');

const config = {
    target: 'server',
    env: {
        API_URL: process.env.API_URL,
        BACKEND_URL: process.env.BACKEND_URL || process.env.API_URL,
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

        return config;
    },
};

module.exports = withOffline(config);
