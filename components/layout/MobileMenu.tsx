import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../interfaces';
import { MenuList } from '../molecules';

interface StyledMenuProps {
  open: boolean;
}

const StyledMobileMenu = styled.nav<StyledMenuProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--primary);
  transform: ${({ open }): string => (open ? 'scale(1.5)' : ' scale(0)')};
  border-radius: 50%;
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  transition: var(--transition);
`;

export const MobileMenu: React.FC = () => {
  const { menuOpen } = useSelector((state: State) => state.ui);

  return (
    <StyledMobileMenu open={menuOpen}>
      <MenuList />
    </StyledMobileMenu>
  );
};
