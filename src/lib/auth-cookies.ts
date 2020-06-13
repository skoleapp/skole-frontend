import { parse, serialize } from 'cookie';
import { IncomingMessage } from 'http';

const TOKEN_NAME = 'token';
export const MAX_AGE = 60 * 60 * 24 * 30; // One month.

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

const parseCookies = (req: IncomingMessage): { [key: string]: string } => {
    const cookie = req.headers.cookie;
    return parse(cookie || '');
};

export const getTokenCookie = (req: IncomingMessage): string => {
    const cookies = parseCookies(req);
    return cookies[TOKEN_NAME];
};
