import React from 'react';
import styled from 'styled-components';
import { IntersectingWrapper } from '../containers';
import { HamburgerButton } from '../molecules';

const StyledNavbar = styled.div`
  height: 5rem;
  background: var(--primary);
`;

export const Navbar: React.FC = () => (
  <StyledNavbar>
    <IntersectingWrapper time={2}>
      <HamburgerButton />
    </IntersectingWrapper>
  </StyledNavbar>
);
