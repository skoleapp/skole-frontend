import getConfig from 'next/config';

const { API_URL, BACKEND_URL } = getConfig().publicRuntimeConfig;

export const env = {
    API_URL,
    BACKEND_URL,
};
