const withPWA = require('next-pwa');
const { nextI18NextRewrites } = require('next-i18next/rewrites')
const prod = process.env.NODE_ENV === 'production';

const config = {
    target: "serverless",
    pwa: {
        dest: 'public',
        register: false,
        skipWaiting: false,
        disable: prod ? false : true,
    },
    publicRuntimeConfig: {
        API_URL: process.env.API_URL,
        BACKEND_URL: process.env.BACKEND_URL,
        CLOUDMERSIVE_API_KEY: process.env.CLOUDMERSIVE_API_KEY,
    },
    typescript: {
        ignoreDevErrors: true,
    },
    experimental: {
        async rewrites() {
          return [
            ...nextI18NextRewrites(
                {
                    en: 'en',
                    fi: 'fi',
                    sv: 'sv',
                }
            )
          ]
        }
      }
};

module.exports = withPWA(config);
