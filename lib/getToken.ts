import cookie from 'cookie';

export const getToken = (req: any) => {
  const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie);
  return cookies.token;
};
