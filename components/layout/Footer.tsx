import { Link, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Column } from '../containers';

const StyledFooter = styled.div`
  height: 8rem;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
`;

export const Footer: React.FC = () => (
  <StyledFooter>
    <Column sm={8} md={6}>
      <Typography variant="h6">© {new Date().getFullYear()} Skole Ltd.</Typography>
      <Link href="/feedback" color="secondary">
        Feedback
      </Link>
    </Column>
  </StyledFooter>
);
