import React from 'react';
import { AuthBox, Centered, Layout } from '../components';
import '../index.css';

const Auth: React.SFC<{}> = () => (
  <Layout title="skole | Authentication">
    <Centered top="40%">
      <AuthBox />
    </Centered>
  </Layout>
);

export default Auth;
