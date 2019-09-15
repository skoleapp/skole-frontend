import React, { useState } from 'react';
import { Anchor, H1 } from '../atoms';
import { RegisterForm } from '../molecules';
import { Redirect } from '../utils';

export const RegisterPage: React.FC = () => {
  const [redirecting, setRedirecting] = useState(false);

  if (redirecting) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <H1>Register</H1>
      <RegisterForm />
      <Anchor onClick={(): void => setRedirecting(true)}>Already a user?</Anchor>
    </>
  );
};
