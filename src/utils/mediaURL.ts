export const mediaURL = (filePath?: string): string => {
    return filePath !== undefined ? String(process.env.API_URL + filePath) : '';
};
