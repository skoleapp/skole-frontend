import cookie from 'cookie';
import { IncomingMessage } from 'http';

// Parse cookie either in the server or in the browser.
export const getToken = (req?: IncomingMessage): string => {
  const { token } = cookie.parse(!!req ? req.headers.cookie || '' : document.cookie);
  return token;
};
