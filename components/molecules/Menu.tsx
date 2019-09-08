import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../redux';
import { MenuListItem } from '../atoms';

interface Props {
  menuOpen: boolean;
  counter: number;
}

const StyledMenu = styled.div<Props>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--primary);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  // Use CSS animations ´forwards´ attribute to keep visibility state after animation
  visibility: hidden;

  // Apply transition after initial render
  transition: ${({ counter }): string => (counter > 1 ? 'var(--transition)' : 'none')};

  // Apply animation after initial render
  animation: ${({ menuOpen, counter }): string => {
    if (counter > 1) {
      return menuOpen ? 'var(--fade-in)' : 'var(--fade-out)';
    } else {
      return 'none';
    }
  }};

  ul {
    margin-right: 2rem;
  }
`;

export const Menu: React.FC = () => {
  const { menuOpen } = useSelector((state: State) => state.ui);
  const [counter, setCounter] = useState(0);

  // Keep log of number of times of menu toggled
  useEffect(() => {
    setCounter(counter + 1);
  }, [menuOpen]);

  return (
    <StyledMenu menuOpen={menuOpen} counter={counter}>
      <ul>
        <MenuListItem href="/">home</MenuListItem>
        <MenuListItem href="/login">login</MenuListItem>
        <MenuListItem href="/register">register</MenuListItem>
        <MenuListItem href="/search-schools">search</MenuListItem>
        <MenuListItem href="/account">account</MenuListItem>
        <MenuListItem href="/feedback"></MenuListItem>
      </ul>
    </StyledMenu>
  );
};
