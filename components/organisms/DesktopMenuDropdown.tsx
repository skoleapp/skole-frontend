import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { MenuOpenProps, State } from '../../interfaces';
import { toggleDesktopMenuDropdown } from '../../redux';
import { Icon } from '../atoms/Icon';
import { MenuList } from '../molecules';

const StyledDesktopMenuDropdown = styled.div`
  display: flex;
  justify-content: center;
`;

const Dropdown = styled.div<MenuOpenProps>`
  position: absolute;
  height: auto;
  width: auto;
  top: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--primary);
  visibility: ${({ open }): string => (open ? 'visible' : 'hidden')};
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  padding: 1rem 0.5rem;
  border: var(--black-border);
  border-style: none solid solid solid;
`;

export const DesktopMenuDropdown: React.FC = () => {
  const { desktopMenuDropdownOpen } = useSelector((state: State) => state.ui);
  const dispatch = useDispatch();
  const node = useRef<any>(); // eslint-disable-line

  const handleClickOutside = (e: Event): void => {
    if (!node.current.contains(e.target)) {
      dispatch(toggleDesktopMenuDropdown(false));
    }
  };

  useEffect(() => {
    if (desktopMenuDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [desktopMenuDropdownOpen]);

  return (
    <StyledDesktopMenuDropdown
      onClick={(): void => {
        dispatch(toggleDesktopMenuDropdown(!desktopMenuDropdownOpen));
      }}
      ref={node}
    >
      <Icon iconName="user-circle" variant="white" iconSize="2" />
      <Dropdown open={desktopMenuDropdownOpen}>
        <MenuList />
      </Dropdown>
    </StyledDesktopMenuDropdown>
  );
};
