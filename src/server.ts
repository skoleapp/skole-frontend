import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';
import morgan from 'morgan';

import { nextI18next } from './i18n';

const port = process.env.PORT || 3001;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const logFormatProd =
    ':remote-addr - :remote-user ":method :url" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';
const logFormatDev = ':method :url :status :response-time ms - :res[content-length]';

(async (): Promise<void> => {
    await app.prepare();
    const server = express();

    if (process.env.NODE_ENV !== 'production') {
        server.use(morgan(logFormatDev));
    } else {
        server.use(morgan(logFormatProd));
    }

    server.use(nextI18NextMiddleware(nextI18next));

    server.get('*', (req: IncomingMessage, res: ServerResponse) => handle(req, res));

    await server.listen(port);
    console.log(`Server running on http://localhost:${port}!`);
})();
