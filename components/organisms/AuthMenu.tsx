import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { State, WidgetOpenProps } from '../../interfaces';
import { toggleAuthMenu } from '../../redux';
import { NavbarIcon } from '../atoms';
import { useWidget } from '../hooks';
import { MenuList } from '../molecules';

const StyledAuthMenu = styled.div`
  display: flex;
  justify-content: center;
`;

const Dropdown = styled.div<WidgetOpenProps>`
  position: absolute;
  height: auto;
  width: auto;
  top: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--white);
  visibility: ${({ open }): string => (open ? 'visible' : 'hidden')};
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  padding: 1rem 0.5rem;
  border: var(--black-border);
  border-style: none solid solid solid;

  a {
    color: var(--primary);
  }
`;

export const AuthMenu: React.FC = () => {
  const { authMenuOpen } = useSelector((state: State) => state.ui);
  const dispatch = useDispatch();
  const node = useWidget('auth-menu');

  return (
    <StyledAuthMenu
      onClick={(): void => {
        dispatch(toggleAuthMenu(!authMenuOpen));
      }}
      ref={node}
    >
      <NavbarIcon iconName="user-circle" />
      <Dropdown open={authMenuOpen}>
        <MenuList />
      </Dropdown>
    </StyledAuthMenu>
  );
};
