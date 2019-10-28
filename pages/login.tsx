import { NextPage } from 'next';
import React from 'react';
import { Layout, LoginCard } from '../components';
import { withPublic } from '../lib';

const LoginPage: NextPage = () => (
  <Layout title="Login">
    <LoginCard />
  </Layout>
);

export default withPublic(LoginPage);
