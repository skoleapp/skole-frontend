import { parse } from 'cookie';
import { IncomingMessage } from 'http';
import * as R from 'ramda';

export const TOKEN_NAME = 'token';
export const MAX_AGE = 60 * 60 * 24 * 30; // 1 month.

// Call API route to set token cookie.
export const setTokenCookie = (token: string): Promise<Response> =>
    fetch('/api/set-cookie', { method: 'POST', body: JSON.stringify({ token }) });

// Call API route to remove token cookie.
export const removeTokenCookie = (): Promise<Response> => fetch('/api/remove-cookie', { method: 'POST' });

const parseCookies = (req?: IncomingMessage): { [key: string]: string } => {
    const cookie = typeof window === 'undefined' ? R.pathOr('', ['headers', 'cookie'], req) : document.cookie;
    return parse(cookie);
};

export const getTokenCookie = (req?: IncomingMessage): string => {
    const cookies = parseCookies(req);
    return cookies[TOKEN_NAME];
};
