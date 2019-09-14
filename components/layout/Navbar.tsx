import React from 'react';
import styled from 'styled-components';
import { useMobileBreakPoint } from '../../utils/useMobileBreakPoint';
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

  return <StyledNavbar>{isMobile ? <HamburgerButton /> : <DesktopMenuItems />}</StyledNavbar>;
};
