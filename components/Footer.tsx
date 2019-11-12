import { Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../styles';
import { TextLink } from './TextLink';

export const Footer: React.FC = () => (
  <StyledFooter>
    <Typography variant="subtitle1">© {new Date().getFullYear()} Skole Ltd.</Typography>
    <TextLink href="/feedback" color="secondary">
      Feedback
    </TextLink>
    <TextLink href="/about" color="secondary">
      About
    </TextLink>
  </StyledFooter>
);

const StyledFooter = styled.div`
  background: var(--primary);
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;

  @media only screen and (max-width: ${breakpoints.SM}) {
    display: none;
  }
`;
