import Link from 'next/link';
import React from 'react';
import { Anchor, Card, H1 } from '../atoms';
import { RegisterForm } from '../molecules';

export const RegisterCard: React.FC = () => (
  <Card>
    <H1>Register</H1>
    <RegisterForm />
    <Link href="/login">
      <Anchor variant="red">Already a user?</Anchor>
    </Link>
  </Card>
);
