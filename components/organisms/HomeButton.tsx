import Link from 'next/link';
import React from 'react';
import { NavbarIcon } from '../molecules';

export const HomeButton: React.FC = () => (
  <Link href="/">
    <NavbarIcon iconName="home" />
  </Link>
);
