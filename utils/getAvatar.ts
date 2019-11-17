export const getAvatar = (avatar: string | null): string => {
  const baseURL = process.env.STATIC_URL;
  return baseURL && avatar
    ? baseURL.concat(avatar)
    : 'http://localhost:8000/static/default_avatar.jpg';
};
