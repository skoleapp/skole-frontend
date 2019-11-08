export const getAvatar = (avatar: string | null): string | undefined => {
  const baseURL = process.env.STATIC_URL;
  return baseURL && avatar ? baseURL.concat(avatar) : '/images/default_avatar.jpg';
};
