import React from 'react';
import { Flexbox } from '../atoms';
import '../index.css';
import { Layout, TopHeader } from '../organisms';
import { Login, Register } from '../templates';

const Auth: React.SFC<{}> = () => (
  <Layout title="skole | Login">
    <TopHeader />
    <Flexbox justifyContent="center" flexDirection="column" alignItems="center">
      <Login />
      <Register />
    </Flexbox>
  </Layout>
);

export default Auth;
