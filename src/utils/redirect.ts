import Router from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';

import { SkolePageContext } from '../types';

// Redirect either on the server or in the browser.
export const redirect = (context: SkolePageContext, pathname: string, query?: ParsedUrlQueryInput): void => {
    if (context.res) {
        context.res.writeHead(303, { Location: pathname });
        context.res.end();
    } else {
        Router.push({ pathname, query });
    }
};
