import cookie from 'js-cookie';
import { NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';

export const auth = (ctx: NextPageContext) => {
  const { token } = nextCookie(ctx);

  // If `ctx.req` is available it means we are on the server.
  // Additionally if there's no token it means the user is not logged in.
  if (ctx.req && ctx.res && !token) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push('/login');
  }

  return token;
};

interface LoginParams {
  token: string;
}

export const login = ({ token }: LoginParams) => {
  cookie.set('token', token, { expires: 1 });
  Router.push('/account');
};

export const logout = () => {
  cookie.remove('token');

  // To support logging out from all windows.
  window.localStorage.setItem('logout', Date.now() as any);
  Router.push('/login');
};
