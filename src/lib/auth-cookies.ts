import { parse } from 'cookie';
import { IncomingMessage } from 'http';
import * as R from 'ramda';
import { apiUrls, TOKEN_NAME } from 'utils';

// Call API route to set token cookie.
export const setTokenCookie = (token: string): Promise<Response> =>
    fetch(apiUrls.setCookie, { method: 'POST', body: JSON.stringify({ token }) });

// Call API route to remove token cookie.
export const removeTokenCookie = (): Promise<Response> => fetch(apiUrls.removeCookie, { method: 'POST' });

const parseCookies = (req?: IncomingMessage): { [key: string]: string } => {
    const cookie = typeof window === 'undefined' ? R.pathOr('', ['headers', 'cookie'], req) : document.cookie;
    return parse(cookie);
};

export const getTokenCookie = (req?: IncomingMessage): string => {
    const cookies = parseCookies(req);
    return cookies[TOKEN_NAME];
};
