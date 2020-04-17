import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';

import { nextI18next } from './i18n';

const port = process.env.PORT || 3001;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    server.use(nextI18NextMiddleware(nextI18next));

    if (process.env.NODE_ENV === 'production') {
        server.use(
            morgan(
                ':remote-addr - :remote-user ":method :url" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
            ),
        );
    }

    server.all('*', (req: IncomingMessage, res: ServerResponse) => handle(req, res));
    server.listen(port);
    console.log(`Server running on http://localhost:${port}!`);
});
