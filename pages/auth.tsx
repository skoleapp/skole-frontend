import React from 'react';
import { Centered, Background } from '../atoms';
import '../index.css';
import { Layout, TopHeader, AuthBox } from '../organisms';

const Auth: React.SFC<{}> = () => (
  <Layout title="skole | Authentication">
    <TopHeader />
    <Background />
    <Centered>
      <AuthBox />
    </Centered>
  </Layout>
);

export default Auth;
