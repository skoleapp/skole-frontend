import { env } from 'config';

export const mediaURL = (filePath: string): string => {
    return process.env.NODE_ENV === 'production' ? filePath : !!filePath ? String(env.API_URL + filePath) : '';
};
