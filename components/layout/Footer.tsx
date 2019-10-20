import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Anchor, Text } from '../atoms';
import { Column } from '../containers';

const StyledFooter = styled.div`
  height: 8rem;
  background: var(--primary);
  color: white;
`;

export const Footer: React.FC = () => (
  <StyledFooter>
    <Column sm={8} md={6}>
      <Text>© {new Date().getFullYear()} Skole Ltd.</Text>
      <Link href="/feedback">
        <Anchor variant="white">Feedback</Anchor>
      </Link>
    </Column>
  </StyledFooter>
);
