import Link from 'next/link';
import React from 'react';
import { Anchor } from '../atoms';
import { NavbarIcon } from '../molecules';

export const HomeButton: React.FC = () => (
  <Link href="/">
    <Anchor>
      <NavbarIcon iconName="home"></NavbarIcon>
    </Anchor>
  </Link>
);
