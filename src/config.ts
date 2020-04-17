import getConfig from 'next/config';

const { API_URL, BACKEND_URL, CLOUDMERSIVE_API_KEY } = getConfig().publicRuntimeConfig;

export const env = {
    API_URL,
    BACKEND_URL,
    CLOUDMERSIVE_API_KEY,
};
