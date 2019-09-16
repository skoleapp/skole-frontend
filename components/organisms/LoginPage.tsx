import Link from 'next/link';
import React from 'react';
import { Anchor, H1 } from '../atoms';
import { Column } from '../containers';
import { LoginForm } from '../molecules';

export const LoginPage: React.FC = () => (
  <>
    <Column>
      <H1>Login</H1>
      <LoginForm />
      <Link href="/register">
        <Anchor variant="red">New user?</Anchor>
      </Link>
    </Column>
  </>
);
