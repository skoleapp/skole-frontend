const withCSS = require('@zeit/next-css');
const withAssetsImport = require('next-assets-import');

module.exports = withCSS(withAssetsImport());
