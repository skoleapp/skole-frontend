export const getAvatar = (avatar: string | null): string => {
  const mediaURL = process.env.MEDIA_URL;
  const staticURL = process.env.STATIC_URL;

  return mediaURL && avatar && avatar !== 'default_avatar.jpg'
    ? mediaURL.concat(avatar)
    : staticURL + '/default_avatar.jpg';
};
