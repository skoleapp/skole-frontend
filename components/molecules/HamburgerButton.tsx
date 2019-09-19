import React, { HTMLProps } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../interfaces';
import { InputCheckedProps } from '../../types';
import { HamburgerButtonCheckbox, HamburgerButtonElements } from '../atoms';
interface HamburgerButtonWrapperProps extends HTMLProps<HTMLElement> {
  checked: boolean | undefined;
}

const HamburgerButtonWrapper = styled.div<HamburgerButtonWrapperProps>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  width: 3rem;
  height: 3rem;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  visibility: ${({ checked }): InputCheckedProps => checked && 'visible'};
`;

export const HamburgerButton: React.FC = () => {
  const { menuOpen } = useSelector((state: State) => state.ui);

  return (
    <HamburgerButtonWrapper checked={menuOpen}>
      <HamburgerButtonCheckbox menuOpen={menuOpen} />
      <HamburgerButtonElements menuOpen={menuOpen} />
    </HamburgerButtonWrapper>
  );
};
