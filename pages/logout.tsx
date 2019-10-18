import cookie from 'cookie';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { Anchor, Button, Card, H2, MainLayout } from '../components';
import { withApollo } from '../lib';
import { LOGOUT } from '../redux';

const LogoutPage: NextPage = () => (
  <MainLayout title="Login">
    <Card>
      <H2>You have been logged out!</H2>
      <Link href="/login">
        <Anchor>
          <Button>log back in</Button>
        </Anchor>
      </Link>
    </Card>
  </MainLayout>
);

LogoutPage.getInitialProps = async ({ req, store, apolloClient }: any): Promise<{}> => {
  store.dispatch({ type: LOGOUT }); // Clear store.

  // Expire the cookie either on server or in browser.
  req
    ? req.headers.cookie || ''
    : (document.cookie = cookie.serialize('token', '', {
        maxAge: -1
      }));

  // Force a reload of all the current queries.
  apolloClient.cache.reset();
  return {};
};

export default withApollo(LogoutPage);
