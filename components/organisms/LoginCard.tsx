import Link from 'next/link';
import React from 'react';
import { Anchor, Card, H1 } from '../atoms';
import { LoginForm } from '../molecules';

export const LoginCard: React.FC = () => (
  <Card>
    <H1>Login</H1>
    <LoginForm />
    <Link href="/register">
      <Anchor variant="red">New user?</Anchor>
    </Link>
  </Card>
);
