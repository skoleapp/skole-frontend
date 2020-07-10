import { serialize } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import { MAX_AGE, TOKEN_NAME } from 'utils';

interface Request extends IncomingMessage {
    body: string;
}

// A middleware for setting token cookie in request headers so that they get picked up by Next.js and Apollo.
// The client will automatically update the cookie in the browser based on this header.
export default (req: Request, res: ServerResponse): void => {
    const { token } = JSON.parse(req.body);

    // Here we must not set the httpOnly option as we want the cookie to be accessible through JavaScript in the client side too.
    const cookie = serialize(TOKEN_NAME, token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });

    res.setHeader('Set-Cookie', cookie);
    res.end();
};
