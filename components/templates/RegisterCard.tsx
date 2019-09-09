import Link from 'next/link';
import React from 'react';
import { Anchor, Card, Title } from '../atoms';
import { RegisterForm } from '../organisms';

export const RegisterCard: React.FC = () => (
  <Card>
    <Title>Register</Title>
    <RegisterForm />
    <Link href="/login">
      <Anchor variant="red">Already a user?</Anchor>
    </Link>
  </Card>
);
