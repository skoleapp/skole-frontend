const withCSS = require('@zeit/next-css');
const WebpackBar = require('webpackbar');
const withAssetsImport = require('next-assets-import');
const withOffline = require('next-offline');
require('dotenv').config();

const prod = process.env.NODE_ENV === 'production';
const API_URL = 'https://api.skoleapp.com/';
const CLOUDMERSIVE_API_KEY = 'f0d72604-8df2-45e8-9d0b-09029ee16525'; // TODO: Remove this when environment variables work in production.
console.log(process.env.CLOUDMERSIVE_API_KEY); // This is a test log to test the environment variables in production.

module.exports = withOffline(
    withAssetsImport(
        withCSS({
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
            target: 'serverless',
            env: {
                API_URL: prod ? API_URL : 'http://localhost:8000/',
                BACKEND_URL: prod ? API_URL : 'http://backend:8000/',
                CLOUDMERSIVE_API_KEY: prod ? CLOUDMERSIVE_API_KEY : process.env.CLOUDMERSIVE_API_KEY,
            },
            webpack: (config, { dev }) => {
                if (dev) {
                    config.devtool = '';
                }

                config.plugins.push(
                    new WebpackBar({
                        fancy: true,
                        profile: true,
                        basic: false,
                    }),
                );

                return config;
            },
            webpackDevMiddleware: config => {
                config.watchOptions = {
                    poll: 1000,
                    aggregateTimeout: 300,
                };

                return config;
            },
        }),
    ),
);
