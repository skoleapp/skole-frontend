const withCSS = require('@zeit/next-css');
const WebpackBar = require('webpackbar');
const withAssetsImport = require('next-assets-import');

module.exports = withAssetsImport(
    withCSS({
        target: 'serverless',
        env: {
            API_URL: process.env.API_URL,
            BACKEND_URL: process.env.BACKEND_URL,
        },
        webpackDevMiddleware: config => {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };

            return config;
        },
        webpack: config => {
            config.plugins.push(
                new WebpackBar({
                    fancy: true,
                    profile: true,
                    basic: false,
                }),
            );

            return config;
        },
    }),
);
