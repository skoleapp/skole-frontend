import React, { HTMLProps } from 'react';
import styled from 'styled-components';
import { MenuOpenProps } from '../../../interfaces';
import { InputCheckedProps } from '../../../types';

interface StyledHamburgerButtonElementsProps extends HTMLProps<HTMLElement> {
  checked: boolean | undefined;
}

const StyledHamburgerButtonElements = styled.div<StyledHamburgerButtonElementsProps>`
  position: relative;
  width: 100%;
  height: 0.15rem;
  background-color: var(--white);
  display: flex;
  justify-content: center;
  border-radius: 1rem;
  transition: all var(--menu-speed) ease;
  transform: ${({ checked }): InputCheckedProps => checked && 'rotate(135deg)'};

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: -1rem;
    width: inherit;
    height: inherit;
    background: inherit;
    border-radius: inherit;
    top: ${({ checked }): InputCheckedProps => checked && '0'};
    transform: ${({ checked }): InputCheckedProps => checked && 'rotate(90deg)'};
  }

  &:after {
    top: ${({ checked }): string => (checked ? `0` : `1rem`)};
  }
`;

export const HamburgerButtonElements: React.FC<MenuOpenProps> = ({ menuOpen }) => (
  <StyledHamburgerButtonElements checked={menuOpen} />
);
