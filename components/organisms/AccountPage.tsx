import Link from 'next/link';
import React from 'react';
import { Button, H1 } from '../atoms';

export const AccountPage: React.FC = () => (
  <>
    <H1>Account</H1>
    <Link href="/edit-account">
      <Button>edit account</Button>
    </Link>
  </>
);
