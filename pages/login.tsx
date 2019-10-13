import { NextPage } from 'next';
import React from 'react';
import { LoginCard, MainLayout } from '../components';
import { checkLoggedIn, redirect, withApollo } from '../lib';

const LoginPage: NextPage = () => (
  <MainLayout title="Login">
    <LoginCard />
  </MainLayout>
);

// eslint-disable-next-line
LoginPage.getInitialProps = async (context: any): Promise<{}> => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);
  if (loggedInUser.user) {
    redirect(context, '/');
  }

  return {};
};

export default withApollo(LoginPage);
