import { NextPage } from 'next';
import React from 'react';
import { LoginCard, MainLayout } from '../components';
import { SkoleContext } from '../interfaces';
import { redirect, withAuthSync } from '../lib';

const LoginPage: NextPage = () => (
  <MainLayout title="Login">
    <LoginCard />
  </MainLayout>
);

LoginPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  const { authenticated } = ctx.store.getState().auth;

  if (authenticated) {
    redirect(ctx, '/');
  }

  return {};
};

export default withAuthSync(LoginPage);
