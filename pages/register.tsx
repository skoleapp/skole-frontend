import { NextPage } from 'next';
import React from 'react';
import { Layout, RegisterCard } from '../components';
import { withPublic } from '../lib';

const RegisterPage: NextPage = () => (
  <Layout title="Register">
    <RegisterCard />
  </Layout>
);

export default withPublic(RegisterPage);
