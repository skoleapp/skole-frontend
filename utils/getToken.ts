import cookie from 'cookie';

// Parse coookie either in the server or in the browser.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getToken = (req: any): string => {
  const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie);
  return cookies.token;
};
