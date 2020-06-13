import { serialize } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';

import { TOKEN_NAME } from '../../lib';

// A middleware for removing token cookie in request headers.
export default (_: IncomingMessage, res: ServerResponse): void => {
    const cookie = serialize(TOKEN_NAME, '', {
        maxAge: -1,
        path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    res.end();
};
