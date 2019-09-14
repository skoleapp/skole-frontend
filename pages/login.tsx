import React from 'react';
import { useSelector } from 'react-redux';
import { LoginCard, MainLayout } from '../components';
import { LoadingScreen } from '../components/layout';
import { Redirect } from '../components/utils';
import { State } from '../interfaces';

const Login: React.FC = () => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);

  if (loading) {
    return <LoadingScreen loadingText="Logging in..." />;
  }

  if (authenticated) {
    return <Redirect to="account" loadingText="Successfully logged in!" />;
  }

  return (
    <MainLayout title="Login">
      <LoginCard />
    </MainLayout>
  );
};

export default Login;
