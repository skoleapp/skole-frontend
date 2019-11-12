import { Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../styles';

export const Logo: React.FC = () => (
  <StyledLogo className="logo">
    <Link href="/">
      <Typography variant="h1">skole</Typography>
    </Link>
  </StyledLogo>
);

const StyledLogo = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;

  @media only screen and (max-width: ${breakpoints.SM}) {
    justify-content: center;
  }

  h1 {
    font-family: 'Ubuntu Mono', monospace !important;
    color: var(--secondary);
    font-size: 1.75rem;
    letter-spacing: 0;
    cursor: pointer;
    text-align: center;
  }
`;
