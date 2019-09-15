import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Anchor } from '../atoms';
import { Column } from '../containers';

const StyledFooter = styled.div`
  height: 8rem;
  background: var(--primary);
`;

const StyledColumn = styled(Column)`
  justify-content: center;
  height: 100%;
`;

export const Footer: React.FC = () => (
  <StyledFooter>
    <StyledColumn sm={8} md={6}>
      <p>© {new Date().getFullYear()} Skole Ltd.</p>
      <Link href="/feedback">
        <Anchor>Feedback</Anchor>
      </Link>
    </StyledColumn>
  </StyledFooter>
);
