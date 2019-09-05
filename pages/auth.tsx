import React from 'react';
import { AuthBox, Background, Centered, Layout, TopHeader } from '../components';
import '../index.css';

const Auth: React.SFC<{}> = () => (
  <Layout title="skole | Authentication">
    <TopHeader />
    <Background />
    <Centered top="40%">
      <AuthBox />
    </Centered>
  </Layout>
);

export default Auth;
