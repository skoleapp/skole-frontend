import cookie from 'js-cookie';
import { NextPage, NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';
import { useEffect } from 'react';

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

export const withAuthSync = (WrappedComponent: NextPage) => {
  const Wrapper = (props: any) => {
    const syncLogout = (event: any) => {
      if (event.key === 'logout') {
        Router.push('/login');
      }
    };

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      };
    }, [null]);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx: NextPageContext) => {
    const token = auth(ctx);

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, token };
  };

  return Wrapper;
};
