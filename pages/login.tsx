import { NextPage } from 'next';
import React from 'react';
import { LoginCard, MainLayout } from '../components';
import { withPublic } from '../lib';

const LoginPage: NextPage = () => (
  <MainLayout title="Login">
    <LoginCard />
  </MainLayout>
);

export default withPublic(LoginPage);
