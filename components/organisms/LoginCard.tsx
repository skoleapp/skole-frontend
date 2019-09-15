import React, { useState } from 'react';
import { Anchor, Card, H1 } from '../atoms';
import { LoginForm } from '../molecules';
import { Redirect } from '../utils';

export const LoginCard: React.FC = () => {
  const [redirecting, setRedirecting] = useState(false);

  if (redirecting) {
    return <Redirect to="/register" />;
  }

  return (
    <Card>
      <H1>Login</H1>
      <LoginForm />
      <Anchor variant="red" onClick={(): void => setRedirecting(true)}>
        New user?
      </Anchor>
    </Card>
  );
};
