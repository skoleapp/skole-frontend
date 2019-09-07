import Link from 'next/link';
import React from 'react';
import { Anchor, Card, Title } from '../atoms';
import { RegisterForm } from '../molecules';

export const RegisterCard: React.FC = () => (
  <Card>
    <Title text="register" />
    <RegisterForm />
    <Link href="/login">
      <Anchor>Already a user?</Anchor>
    </Link>
  </Card>
);
