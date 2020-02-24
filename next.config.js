const withCSS = require('@zeit/next-css');
const WebpackBar = require('webpackbar');
const withAssetsImport = require('next-assets-import');

const withTM = require('next-transpile-modules');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins(
    [
        [
            withTM,
            {
                transpileModules: ['ol'],
            },
        ],
    ],
    withAssetsImport(
        withCSS({
            target: 'serverless',
            env: {
                API_URL: process.env.API_URL,
                BACKEND_URL: process.env.BACKEND_URL,
            },
            webpack: (config, { dev }) => {
                if (dev) {
                    config.devtool = '';
                }

                config.plugins.push(new WebpackBar());

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
