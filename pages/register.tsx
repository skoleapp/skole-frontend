import { NextPage } from 'next';
import React from 'react';
import { MainLayout, RegisterCard } from '../components';
import { checkLoggedIn, redirect } from '../lib';

const RegisterPage: NextPage = () => (
  <MainLayout title="Register">
    <RegisterCard />
  </MainLayout>
);

// eslint-disable-next-line
RegisterPage.getInitialProps = async (context: any): Promise<{}> => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);

  if (loggedInUser.user) {
    redirect(context, '/');
  }

  return {};
};

export default RegisterPage;
