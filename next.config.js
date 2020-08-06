const withPWA = require('next-pwa');
const prod = process.env.NODE_ENV === 'production';

const config = {
    pwa: {
        dest: 'public',
        register: false,
        skipWaiting: false,
        disable: !prod,
    },
    publicRuntimeConfig: {
        API_URL: process.env.API_URL,
        BACKEND_URL: process.env.BACKEND_URL || process.env.API_URL,
    },
    typescript: {
        ignoreDevErrors: true,
    },
    exportTrailingSlash: true,
};

module.exports = withPWA(config);
