import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';

import { nextI18next } from './i18n';

const port = process.env.PORT || 3001;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

(async (): Promise<void> => {
    await app.prepare();
    const server = express();
    server.use(morgan('combined'));
    server.use(nextI18NextMiddleware(nextI18next));
    server.get('*', (req: IncomingMessage, res: ServerResponse) => handle(req, res));
    await server.listen(port);
    console.log(`Server running on http://localhost:${port}!`);
})();
