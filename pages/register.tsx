import { NextPage } from 'next';
import React from 'react';
import { MainLayout, RegisterCard } from '../components';
import { getUserMe, redirect } from '../lib';

const RegisterPage: NextPage = () => (
  <MainLayout title="Register">
    <RegisterCard />
  </MainLayout>
);

// eslint-disable-next-line
RegisterPage.getInitialProps = async (ctx: any): Promise<{}> => {
  const { userMe } = await getUserMe(ctx.apolloClient);

  if (userMe) {
    redirect(ctx, '/');
  }

  return {};
};

export default RegisterPage;
