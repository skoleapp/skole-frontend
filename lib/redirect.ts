import Router from 'next/router';

// eslint-disable-next-line
export const redirect = (context: any, target: string) => {
  if (context.res) {
    // server
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    // browser
    Router.replace(target);
  }
};
