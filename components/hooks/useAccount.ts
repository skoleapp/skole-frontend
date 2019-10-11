import { useQuery } from 'graphql-hooks';
import { NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';

export const useAccount = async (ctx: NextPageContext) => {
  const { token } = nextCookie(ctx);
  const { loading, error, data } = useQuery(GET_USER_ME, {
    variables: { token }
  });

  const redirectOnError = () =>
    typeof window !== 'undefined'
      ? Router.push('/login')
      : ctx.res && ctx.res.writeHead(302, { Location: '/login' }).end();

  if (!loading && error) {
    return await redirectOnError();
  }

  if (!loading && data) {
    return data;
  }
};
