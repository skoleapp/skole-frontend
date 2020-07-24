import { parse } from 'cookie';
import { IncomingMessage } from 'http';
import * as R from 'ramda';
import { TOKEN_NAME } from 'utils';

const parseCookies = (req?: IncomingMessage): { [key: string]: string } => {
    const cookie = typeof window === 'undefined' ? R.pathOr('', ['headers', 'cookie'], req) : document.cookie;
    return parse(cookie);
};

export const getTokenCookie = (req?: IncomingMessage): string => {
    const cookies = parseCookies(req);
    return cookies[TOKEN_NAME];
};
