import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';

import { nextI18next } from './i18n';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3001;
const app = next({ dev });
const handle = app.getRequestHandler();
const morganConfig =
    ':remote-addr - :remote-user ":method :url" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

(async (): Promise<void> => {
    await app.prepare();
    const server = express();
    await nextI18next.initPromise;
    server.use(nextI18NextMiddleware(nextI18next));
    !dev && server.use(morgan(morganConfig));
    server.get('*', (req: IncomingMessage, res: ServerResponse) => handle(req, res));
    await server.listen(port);
    console.log(`Server running on http://localhost:${port}!`);
})();
