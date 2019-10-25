import { NextPage } from 'next';
import React from 'react';
import { getUserMe } from '../actions';
import { MainLayout, RegisterCard } from '../components';
import { SkoleContext } from '../interfaces';
import { redirect, withApollo } from '../lib';

const RegisterPage: NextPage = () => (
  <MainLayout title="Register">
    <RegisterCard />
  </MainLayout>
);

RegisterPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  const { userMe } = await getUserMe(ctx.apolloClient);

  if (userMe) {
    redirect(ctx, '/');
  }

  return {};
};

export default withApollo(RegisterPage);
