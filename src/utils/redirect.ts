import { ParsedUrlQueryInput } from 'querystring';
import Router from 'next/router';
import { SkoleContext } from '../types';

// Redirect either on the server or in the browser.
export const redirect = (context: SkoleContext, pathname: string, query?: ParsedUrlQueryInput): void => {
    if (context.res) {
        context.res.writeHead(303, { Location: pathname });
        context.res.end();
    } else {
        Router.push({ pathname, query });
    }
};
