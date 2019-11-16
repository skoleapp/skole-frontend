import { Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export const Logo: React.FC = () => (
  <Link href="/">
    <StyledLogo id="logo" variant="h1">
      skole
    </StyledLogo>
  </Link>
);

const StyledLogo = styled(Typography)`
  font-family: 'Ubuntu Mono', monospace !important;
  color: var(--secondary);
  font-size: 1.75rem !important;
  letter-spacing: 0;
  cursor: pointer;
  text-align: center;
`;
