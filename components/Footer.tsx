import { Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { TextLink } from './TextLink';

export const Footer: React.FC = () => (
  <StyledFooter>
    <Typography variant="subtitle1">© {new Date().getFullYear()} Skole Ltd.</Typography>
    <TextLink href="/feedback" color="secondary">
      Feedback
    </TextLink>
  </StyledFooter>
);

const StyledFooter = styled.div`
  height: 5rem;
  background: var(--primary);
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
