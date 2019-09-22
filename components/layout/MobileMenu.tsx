import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../interfaces';
import { MenuList } from '../molecules';

interface StyledMenuProps {
  open: boolean;
}

const StyledMenu = styled.nav<StyledMenuProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--primary);
  transform: ${({ open }): string => (open ? 'translateX(0)' : 'translateX(-100%)')};
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: var(--transition);
`;

export const MobileMenu: React.FC = () => {
  const { menuOpen } = useSelector((state: State) => state.ui);

  return (
    <StyledMenu open={menuOpen}>
      <MenuList />
    </StyledMenu>
  );
};
