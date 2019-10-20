import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toggleMenu } from '../../actions';
import { State, WidgetOpenProps } from '../../interfaces';

const StyledHamburgerButton = styled.button<WidgetOpenProps>`
  position: absolute;
  top: 1.2rem;
  right: 1.3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 3rem;
  height: 3rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  &:focus {
    outline: none;
  }

  div {
    width: 3rem;
    height: 0.25rem;
    background: var(--white);
    border-radius: 1rem;
    transition: var(--transition);
    position: relative;
    transform-origin: 0.1rem;
    margin-left: ${({ open }): string | false => open && '0.35rem'};

    :first-child {
      transform: ${({ open }): string => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ open }): string => (open ? '0' : '1')};
    }

    :nth-child(3) {
      transform: ${({ open }): string => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;

export const HamburgerButton: React.FC = () => {
  const { menuOpen } = useSelector((state: State) => state.ui);
  const dispatch = useDispatch();

  return (
    <StyledHamburgerButton
      open={menuOpen}
      onClick={(): void => {
        dispatch(toggleMenu(!menuOpen));
      }}
    >
      <div />
      <div />
      <div />
    </StyledHamburgerButton>
  );
};
