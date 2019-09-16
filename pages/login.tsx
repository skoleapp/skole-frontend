import React from 'react';
import { LoginPage, MainLayout } from '../components';

const Login: React.FC = () => (
  <MainLayout title="Login" secondary>
    <LoginPage />
  </MainLayout>
);

export default Login;
