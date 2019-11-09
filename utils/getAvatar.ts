export const getAvatar = (avatar: string | null): string => {
  const baseURL = process.env.MEDIA_URL;
  return baseURL && avatar
    ? baseURL.concat(avatar)
    : 'http://localhost:8000/media/default_avatar.jpg';
};
