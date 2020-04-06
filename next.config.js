const withCSS = require('@zeit/next-css');
const withAssetsImport = require('next-assets-import');
const withOffline = require('next-offline');

module.exports = withCSS(
    withAssetsImport(
        withOffline({
            target: 'serverless',
            env: {
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
        }),
    ),
);
