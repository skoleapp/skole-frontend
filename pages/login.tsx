import React from 'react';
import { Layout, TopHeader } from '../organisms';
import '../index.css';
import { Signin, Signup } from '../templates';
import { FlexBox } from '../atoms';

const Login: React.SFC<{}> = () => (
  <Layout title="skole | Login">
    <TopHeader />
    <FlexBox justifyContent="center" flexDirection="column" alignItems="center">
      <Signin></Signin>
      <Signup></Signup>
    </FlexBox>
  </Layout>
);

export default Login;
