import Router from 'next/router';
import { SkoleContext } from '../interfaces';

// Redirect either on the server or in the browser.
export const redirect = (context: SkoleContext, target: string) => {
  if (context.res) {
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    Router.push(target);
  }
};
