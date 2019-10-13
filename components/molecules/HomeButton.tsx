import Link from 'next/link';
import React from 'react';
import { Anchor, NavbarIcon } from '../atoms';

export const HomeButton: React.FC = () => (
  <Link href="/">
    <Anchor>
      <NavbarIcon iconName="home" />
    </Anchor>
  </Link>
);
