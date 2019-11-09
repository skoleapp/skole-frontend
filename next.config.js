const withCSS = require('@zeit/next-css');
const WebpackBar = require('webpackbar');

module.exports = withCSS({
  target: 'serverless',
  env: {
    API_URL: process.env.API_URL,
    STATIC_URL: process.env.STATIC_URL
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    };

    return config;
  },
  webpack: config => {
    config.plugins.push(
      new WebpackBar({
        fancy: true,
        profile: true,
        basic: false
      })
    );

    return config;
  }
});
