import { Box, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { TextLink } from './TextLink';

export const Footer: React.FC = () => (
  <StyledFooter
    className="desktop-only"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
  >
    <Typography variant="subtitle1" color="secondary">
      © {new Date().getFullYear()} Skole Ltd.
    </Typography>
    <TextLink href="/about" color="secondary">
      About
    </TextLink>
    <TextLink href="/contact" color="secondary">
      Contact
    </TextLink>
  </StyledFooter>
);

const StyledFooter = styled(Box)`
  background: var(--primary);
  padding: 0.5rem 0;
`;
