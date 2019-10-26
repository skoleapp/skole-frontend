import { NextPage } from 'next';
import React from 'react';
import { MainLayout, RegisterCard } from '../components';
import { withPublic } from '../lib';

const RegisterPage: NextPage = () => (
  <MainLayout title="Register">
    <RegisterCard />
  </MainLayout>
);

export default withPublic(RegisterPage);
