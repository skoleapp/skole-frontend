import React from 'react';
import styled from 'styled-components';
import { useMobileBreakPoint } from '../../utils';
import { DesktopMenuItems, HamburgerButton } from '../molecules';

const StyledNavbar = styled.div`
  position: fixed;
  z-index: 1;
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
