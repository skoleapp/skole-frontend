import Link from 'next/link';
import React from 'react';
import { Anchor, H1 } from '../atoms';
import { RegisterForm } from '../molecules';

export const RegisterPage: React.FC = () => (
  <>
    <H1>Register</H1>
    <RegisterForm />
    <Link href="/link">
      <Anchor>Already a user?</Anchor>
    </Link>
  </>
);
