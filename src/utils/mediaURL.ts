export const mediaURL = (filePath?: string): string => {
    return filePath !== undefined ? String(process.env.BACKEND_URL + filePath) : '';
};
