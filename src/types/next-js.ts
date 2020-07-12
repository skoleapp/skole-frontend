// Types for SSR context used with Next.js data fetching methods.

import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';

// Ignore: previewData is typed as any in next.js source as well.
export interface SSRContext {
    req: IncomingMessage;
    res: ServerResponse;
    params?: ParsedUrlQuery;
    query: ParsedUrlQuery;
    preview?: boolean;
    previewData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface I18nProps {
    namespacesRequired: string[];
}
