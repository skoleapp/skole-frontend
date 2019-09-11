import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { MenuOpenProps } from '../../../interfaces';
import { toggleMenu } from '../../../redux';

const StyledHamburgerButtonCheckbox = styled.input`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  width: 3.75rem;
  height: 3.75rem;
  opacity: 0;
  z-index: 2;
`;

export const HamburgerButtonCheckbox: React.FC<MenuOpenProps> = ({ menuOpen }) => {
  const dispatch = useDispatch();

  return (
    <StyledHamburgerButtonCheckbox
      type="checkbox"
      checked={menuOpen}
      onChange={(): void => {
        dispatch(toggleMenu(!menuOpen));
      }}
    />
  );
};
