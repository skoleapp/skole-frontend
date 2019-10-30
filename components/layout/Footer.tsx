import { Link, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

export const Footer: React.FC = () => (
  <StyledFooter>
    <Typography variant="h6">© {new Date().getFullYear()} Skole Ltd.</Typography>
    <Link href="/feedback" color="secondary">
      Feedback
    </Link>
  </StyledFooter>
);

const StyledFooter = styled.div`
  height: 8rem;
  background: var(--primary);
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
