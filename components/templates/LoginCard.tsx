import Link from 'next/link';
import React from 'react';
import { Anchor, Card, Title } from '../atoms';
import { LoginForm } from '../organisms';

export const LoginCard: React.FC = () => (
  <Card>
    <Title text="login" />
    <LoginForm />
    <Link href="/register">
      <Anchor variant="red">New user?</Anchor>
    </Link>
  </Card>
);
