import Router from 'next/router';
import { SkoleContext } from '../types';

// Redirect either on the server or in the browser.
export const redirect = (context: SkoleContext, target: string): void => {
    if (context.res) {
        context.res.writeHead(303, { Location: target });
        context.res.end();
    } else {
        Router.push(target);
    }
};
