export const mediaURL = (filePath: string): string => {
    return process.env.NODE_ENV === 'production' ? filePath : String(process.env.API_URL + filePath);
};
