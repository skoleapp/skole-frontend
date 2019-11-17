import { Box, Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../styles';

export const Logo: React.FC = () => (
  <StyledLogo>
    <Link href="/">
      <Typography variant="h1">skole</Typography>
    </Link>
  </StyledLogo>
);

const StyledLogo = styled(Box)`
  flex-grow: 1;

  .MuiTypography-root {
    font-family: 'Ubuntu Mono', monospace !important;
    color: var(--secondary);
    font-size: 1.75rem !important;
    letter-spacing: 0;
    cursor: pointer;
    width: 6rem;

    @media only screen and (max-width: ${breakpoints.SM}) {
      margin: 0 auto;
    }
  }
`;
