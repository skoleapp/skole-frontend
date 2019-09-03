import React from 'react';
import { Header, Flexbox, Button } from '../atoms';
import Link from 'next/link';

// should include Login/Signup or account in the left
// Skole icon in the center
// Dropdown menu in the right
// if logged in, show account
const isLoggedIn = false;

export const TopHeader: React.SFC<{}> = () => (
  <Header>
    <Flexbox justifyContent="space-between" alignItems="center" height="100%">
      {!isLoggedIn ? (
        <Link href="/auth">
          <Button width="100px">Login</Button>
        </Link>
      ) : (
        <div>Logged in !</div>
      )}
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
