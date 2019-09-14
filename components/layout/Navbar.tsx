import React from 'react';
import styled from 'styled-components';
import { HamburgerButton } from '../molecules';
import { DesktopNavbar } from './DesktopNavbar';

const StyledNavbar = styled.div`
  position: fixed;
  z-index: 1;
  height: 5rem;
  width: 100%;
  background: var(--primary);
`;

export const Navbar: React.FC = () => (
  <StyledNavbar>
    <DesktopNavbar />
    <HamburgerButton />
  </StyledNavbar>
);
