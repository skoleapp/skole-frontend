const withCSS = require('@zeit/next-css');
const WebpackBar = require('webpackbar');

module.exports = withCSS({
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
