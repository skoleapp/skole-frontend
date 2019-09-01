import React from 'react';
import { Header, FlexBox, Button } from '../atoms';
import Link from 'next/link';

// should include Login/Signup or account in the left
// Skole icon in the center
// Dropdown menu in the right

export const TopHeader: React.SFC<{}> = () => (
  <Header>
    <FlexBox justifyContent="space-between" alignItems="center" height="100%">
      <Link href="/auth">
        <Button width="100px">Login</Button>
      </Link>
      <Link href="/">
        <Button width="100px">Skole</Button>
      </Link>
      <Link href="/search-schools">
        <Button width="100px">=</Button>
      </Link>
    </FlexBox>
  </Header>
);
export default TopHeader;
