import { NextPage } from 'next';
import React from 'react';
import { getUserMe } from '../actions';
import { LoginCard, MainLayout } from '../components';
import { SkoleContext } from '../interfaces';
import { redirect, withApollo } from '../lib';

const LoginPage: NextPage = () => (
  <MainLayout title="Login">
    <LoginCard />
  </MainLayout>
);

// eslint-disable-next-line
LoginPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  const { userMe } = await ctx.store.dispatch(getUserMe(ctx.apolloClient));

  if (userMe) {
    redirect(ctx, '/');
  }

  return {};
};

export default withApollo(LoginPage);
