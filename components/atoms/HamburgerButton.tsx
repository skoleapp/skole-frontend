import { HTMLProps, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { State, toggleMenu } from '../../redux';

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
  visibility: ${({ checked }) => checked && `visible`};
`;

const HamburgerButtonCheckbox = styled.input`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  opacity: 0;
`;

interface StyledHamburgerButtonProps extends HTMLProps<HTMLElement> {
  checked: boolean | undefined;
}

const StyledHamburgerButton = styled.div<StyledHamburgerButtonProps>`
  position: relative;
  width: 100%;
  height: 0.15rem;
  background-color: var(--white);
  display: flex;
  justify-content: center;
  border-radius: 1rem;
  transition: all 0.6s ease;
  transform: ${({ checked }) => checked && `rotate(135deg)`};

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: -1rem;
    width: inherit;
    height: inherit;
    background: inherit;
    border-radius: inherit;
    top: ${({ checked }) => checked && `0`};
    transform: ${({ checked }) => checked && `rotate(90deg)`};
  }

  &:after {
    top: ${({ checked }) => (checked ? `0` : `1rem`)};
  }
`;

export const HamburgerButton = () => {
  const { menuOpen } = useSelector((state: State) => state.ui);
  const [checked, setChecked] = useState(menuOpen);
  const dispatch = useDispatch();

  return (
    <HamburgerButtonWrapper checked={checked}>
      <HamburgerButtonCheckbox
        type="checkbox"
        checked={checked}
        onChange={() => dispatch(toggleMenu()) && setChecked(!checked)}
      />
      <StyledHamburgerButton checked={checked} />
    </HamburgerButtonWrapper>
  );
};
