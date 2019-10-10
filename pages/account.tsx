import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';
import React from 'react';
import { AccountPage, MainLayout, PrivatePage } from '../components';
import { getHost, withAuthSync } from '../utils';

const Account: NextPage = () => {
  // const [user, loading] = useAccount();

  // if (loading) {
  //   return <LoadingScreen loadingText="Loading account details..." />;
  // }

  return (
    <MainLayout title="Account">
      <PrivatePage component={AccountPage} />
    </MainLayout>
  );
};

Account.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx);
  const apiUrl = getHost(ctx.req) + '/account';

  const redirectOnError = () =>
    typeof window !== 'undefined'
      ? Router.push('/login')
      : ctx.res && ctx.res.writeHead(302, { Location: '/login' }).end();

  try {
    const res = await fetch(apiUrl, {
      credentials: 'include',
      headers: {
        Authorization: JSON.stringify({ token })
      }
    });

    if (res.ok) {
      const js = await res.json();
      console.log('js', js);
      return js;
    } else {
      return await redirectOnError();
    }
  } catch (error) {
    return redirectOnError();
  }
};

export default withAuthSync(Account);
