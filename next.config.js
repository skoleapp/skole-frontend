const withOffline = require('next-offline');

const config = {
    target: 'serverless',
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
};

module.exports = withOffline(config);
