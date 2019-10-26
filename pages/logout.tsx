import { NextPage } from 'next';
import React from 'react';
import { LogoutCard, MainLayout } from '../components';
import { withPublic } from '../lib';

const LogoutPage: NextPage = () => (
  <MainLayout title="Login">
    <LogoutCard />
  </MainLayout>
);

export default withPublic(LogoutPage);
