import Link from 'next/link';
import React from 'react';
import { Button, Flexbox, Header } from '../atoms';

// should include Login/Signup or account in the left
// Skole icon in the center
// Dropdown menu in the right

export const TopHeader: React.SFC<{}> = () => (
  <Header>
    <Flexbox justifyContent="space-between" alignItems="center">
      <Link href="/login">
        <Button width="100px">Login</Button>
      </Link>
      <Link href="/">
        <Button width="100px">Skole</Button>
      </Link>
      <Link href="/search-schools">
        <Button width="100px">=</Button>
      </Link>
    </Flexbox>
  </Header>
);
export default TopHeader;
