import { NextPage } from 'next';
import React from 'react';
import { Layout, LogoutCard } from '../components';
import { withPublic } from '../utils';

const LogoutPage: NextPage = () => (
  <Layout title="Login">
    <LogoutCard />
  </Layout>
);

export default withPublic(LogoutPage);
