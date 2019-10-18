import { NextPage } from 'next';
import React from 'react';
import { LoginCard, MainLayout } from '../components';
import { getUserMe, redirect, withApollo } from '../lib';

const LoginPage: NextPage = () => (
  <MainLayout title="Login">
    <LoginCard />
  </MainLayout>
);

// eslint-disable-next-line
LoginPage.getInitialProps = async (ctx: any): Promise<{}> => {
  const { userMe } = await getUserMe(ctx.apolloClient);

  if (userMe) {
    redirect(ctx, '/');
  }

  return {};
};

export default withApollo(LoginPage);
