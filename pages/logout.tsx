import cookie from 'cookie';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useApolloClient } from 'react-apollo';
import { Anchor, Button, Card, H2, MainLayout } from '../components';
import { withApollo } from '../lib';

const LogoutPage: NextPage = () => {
  const apolloClient = useApolloClient();

  useEffect(() => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1 // Expire the cookie immediately
    });

    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    apolloClient.cache.reset();
  }, []);

  return (
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
};

// LogoutPage.getInitialProps = async ({ req, store, apolloClient }: SkoleContext): Promise<{}> => {
//   store.dispatch({ type: LOGOUT }); // Clear store.

//   // Expire the cookie either on server or in the browser.
//   req
//     ? req.headers.cookie || ''
//     : (document.cookie = cookie.serialize('token', '', {
//         maxAge: -1
//       }));

//   // Force a reload of all the current queries.
//   apolloClient.cache.reset();
//   return {};
// };

export default withApollo(LogoutPage);
