import { Home } from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import { Anchor, NavbarIcon } from '../atoms';

export const HomeButton: React.FC = () => (
  <Link href="/">
    <Anchor>
      <NavbarIcon icon={Home} />
    </Anchor>
  </Link>
);
