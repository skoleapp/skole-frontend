import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { MenuOpenProps, State } from '../../interfaces';
import { toggleDesktopMenuDropdown } from '../../redux';
import { Icon } from '../atoms/Icon';
import { MenuList } from '../molecules';

const StyledDesktopMenuDropdown = styled.div`
  position: fixed;
  top: 0;
  right: 0;
`;

const ToggleIcon = styled.div`
  position: fixed:
  z-index: 1;
  height: 5rem;
  width: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Dropdown = styled.div<MenuOpenProps>`
  position: fixed;
  height: auto;
  width: 10rem;
  top: 5rem;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--primary);
  visibility: ${({ open }): string => (open ? 'visible' : 'hidden')};
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  padding-bottom: 1rem;
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
    <StyledDesktopMenuDropdown ref={node}>
      <ToggleIcon
        onClick={(): void => {
          dispatch(toggleDesktopMenuDropdown(!desktopMenuDropdownOpen));
        }}
      >
        <Icon iconName="user-circle" variant="white" />
      </ToggleIcon>
      <Dropdown open={desktopMenuDropdownOpen}>
        <MenuList />
      </Dropdown>
    </StyledDesktopMenuDropdown>
  );
};
