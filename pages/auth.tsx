import React from 'react';
import { FlexBox } from '../atoms';
import '../index.css';
import { Layout, TopHeader } from '../organisms';
import { Login, Register } from '../templates';

const Auth: React.SFC<{}> = () => (
  <Layout title="skole | Login">
    <TopHeader />
    <FlexBox justifyContent="center" flexDirection="column" alignItems="center">
      <Login />
      <Register />
    </FlexBox>
  </Layout>
);

export default Auth;
