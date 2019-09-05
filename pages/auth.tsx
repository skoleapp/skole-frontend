import React from 'react';
import { Background, Centered } from '../components/atoms';
import { AuthBox, Layout, TopHeader } from '../components/organisms';
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
