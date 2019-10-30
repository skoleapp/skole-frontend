const withCSS = require('@zeit/next-css');
const withAssetsImport = require('next-assets-import');
const WebpackBar = require('webpackbar');

module.exports = withCSS(
  withAssetsImport({
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
  })
);
