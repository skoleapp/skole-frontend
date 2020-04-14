const withOffline = require('next-offline');

module.exports = withOffline({
    publicRuntimeConfig: {
        API_URL: process.env.API_URL,
        BACKEND_URL: process.env.BACKEND_URL,
        CLOUDMERSIVE_API_KEY: process.env.CLOUDMERSIVE_API_KEY,
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
    experimental: {
        async rewrites() {
            return [
                {
                    source: '/service-worker.js',
                    destination: '/_next/static/service-worker.js',
                },
            ];
        },
    },
});
