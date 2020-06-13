import { parse } from 'cookie';
import { serialize } from 'cookie';
import { IncomingMessage } from 'http';
import * as R from 'ramda';

const TOKEN_NAME = 'token';
const MAX_AGE = 60 * 60 * 24 * 30; // 1 month.

export const setTokenCookie = (token: string): void => {
    document.cookie = serialize(TOKEN_NAME, token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
};

export const removeTokenCookie = (): void => {
    document.cookie = serialize(TOKEN_NAME, '', {
        maxAge: -1,
        path: '/',
    });
};

const parseCookies = (req?: IncomingMessage): { [key: string]: string } => {
    const cookie = typeof window === 'undefined' ? R.pathOr('', ['headers', 'cookie'], req) : document.cookie;
    return parse(cookie);
};

export const getTokenCookie = (req?: IncomingMessage): string => {
    const cookies = parseCookies(req);
    return cookies[TOKEN_NAME];
};
