import { Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { SM } from '../../utils';

export const Logo: React.FC = () => (
  <StyledLogo className="logo">
    <Link href="/">
      <Typography variant="h1">skole</Typography>
    </Link>
  </StyledLogo>
);

const StyledLogo = styled.div`
  flex-grow: 1;

  h1 {
    font-family: 'Ubuntu Mono', monospace !important;
    color: var(--secondary);
    font-size: 1.75rem;
    text-shadow: var(--text-shadow);
    letter-spacing: 0;
    cursor: pointer;
    width: 6rem;
    text-align: center;

    @media only screen and (max-width: ${SM}) {
      margin: 0 auto;
    }
  }
`;
