import * as url from 'url';

export const mediaURL = (filePath: string): string => {
    return !filePath ? '' : filePath.includes('//') ? filePath : url.resolve(process.env.API_URL || '', filePath);
};
