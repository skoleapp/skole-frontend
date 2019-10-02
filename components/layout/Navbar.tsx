import React from 'react';
import styled from 'styled-components';
import { useMobileBreakPoint } from '../hooks';
import { HamburgerButton, HomeButton } from '../molecules';
import { AuthMenu, SearchWidget } from '../organisms';

const StyledNavbar = styled.div`
  height: 5rem;
  width: 100%;
  background: var(--primary);
`;

const DesktopNavbarItems = styled.div`
  height: 100%;
  width: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const Navbar: React.FC = () => {
  const isMobile = useMobileBreakPoint();

  // Render empty navbar until a value is resolved
  if (isMobile === null) {
    return <StyledNavbar />;
  }

  return (
    <StyledNavbar>
      {isMobile ? (
        <HamburgerButton />
      ) : (
        <DesktopNavbarItems>
          <HomeButton />
          <SearchWidget />
          <AuthMenu />
        </DesktopNavbarItems>
      )}
    </StyledNavbar>
  );
};
