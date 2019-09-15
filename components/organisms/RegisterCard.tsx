import React, { useState } from 'react';
import { Anchor, Card, H1 } from '../atoms';
import { RegisterForm } from '../molecules';
import { Redirect } from '../utils';

export const RegisterCard: React.FC = () => {
  const [redirecting, setRedirecting] = useState(false);

  if (redirecting) {
    return <Redirect to="/login" />;
  }

  return (
    <Card>
      <H1>Register</H1>
      <RegisterForm />
      <Anchor variant="red" onClick={(): void => setRedirecting(true)}>
        Already a user?
      </Anchor>
    </Card>
  );
};
