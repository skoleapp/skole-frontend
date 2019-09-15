import React, { useState } from 'react';
import { Anchor, H1 } from '../atoms';
import { Column } from '../containers';
import { LoginForm } from '../molecules';
import { Redirect } from '../utils';

export const LoginPage: React.FC = () => {
  const [redirecting, setRedirecting] = useState(false);

  if (redirecting) {
    return <Redirect to="/register" />;
  }

  return (
    <>
      <Column>
        <H1>Login</H1>
        <LoginForm />
        <Anchor onClick={(): void => setRedirecting(true)}>New user?</Anchor>
      </Column>
    </>
  );
};
