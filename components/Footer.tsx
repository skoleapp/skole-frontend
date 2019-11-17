import { Box, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../styles';
import { TextLink } from './TextLink';

export const Footer: React.FC = () => (
  <StyledFooter display="flex" flexDirection="column" alignItems="center" justifyContent="center">
    <Typography variant="subtitle1">© {new Date().getFullYear()} Skole Ltd.</Typography>
    <TextLink href="/feedback" color="secondary">
      Feedback
    </TextLink>
    <TextLink href="/about" color="secondary">
      About
    </TextLink>
  </StyledFooter>
);

const StyledFooter = styled(Box)`
  background: var(--primary);
  color: var(--white);
  padding: 0.5rem 0;
  height: 8rem;

  @media only screen and (max-width: ${breakpoints.SM}) {
    display: none !important;
  }
`;
