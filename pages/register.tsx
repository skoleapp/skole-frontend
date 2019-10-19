import { NextPage } from 'next';
import React from 'react';
import { MainLayout, RegisterCard } from '../components';
import { SkoleContext } from '../interfaces';
import { redirect, withAuthSync } from '../lib';

const RegisterPage: NextPage = () => (
  <MainLayout title="Register">
    <RegisterCard />
  </MainLayout>
);

RegisterPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  const { authenticated } = ctx.store.getState().auth;

  if (authenticated) {
    redirect(ctx, '/');
  }

  return {};
};

export default withAuthSync(RegisterPage);
