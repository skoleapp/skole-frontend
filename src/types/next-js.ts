import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';

// Types for SSR context used with Next.js data fetching methods.
// Ignore: previewData is typed as any in next.js source as well.
export interface SSRContext {
  req: IncomingMessage;
  res: ServerResponse;
  params?: ParsedUrlQuery;
  query: ParsedUrlQuery;
  preview?: boolean;
  previewData?: unknown;
}
