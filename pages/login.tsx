import React from 'react';
import { Layout, TopHeader } from '../organisms';
import '../index.css';
import { Signin, Signup } from '../templates';
import { register, authenticate } from '../redux/actions/authActions';
import { FlexBox } from '../atoms';

const Login: React.SFC<{}> = () => (
  <Layout title="skole | Login">
    <TopHeader />
    <FlexBox justifyContent="center" flexDirection="column" alignItems="center">
      <Signin authenticate={authenticate}></Signin>
      <Signup register={register}></Signup>
    </FlexBox>
  </Layout>
);

export default Login;
