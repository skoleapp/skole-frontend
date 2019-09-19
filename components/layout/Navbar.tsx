import React from 'react';
import styled from 'styled-components';
import { useMobileBreakPoint } from '../hooks';
import { HamburgerButton } from '../molecules';
import { DesktopMenuItems } from '../organisms';

const StyledNavbar = styled.div`
  height: 5rem;
  width: 100%;
  background: var(--primary);
`;

export const Navbar: React.FC = () => {
  const isMobile = useMobileBreakPoint();

  // Render empty navbar until a value is resolved
  if (isMobile === null) {
    return <StyledNavbar />;
  }

  return <StyledNavbar>{isMobile ? <HamburgerButton /> : <DesktopMenuItems />}</StyledNavbar>;
};
