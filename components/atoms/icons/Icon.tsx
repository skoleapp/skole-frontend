import React from 'react';
import styled from 'styled-components';
import { IconProps, Variant } from '../../../interfaces';
import { getColorForVariant } from '../../../utils';

const getIconSize = (size: number): string => {
  switch (size) {
    case 1:
      return '1rem';
    case 2:
      return '2rem';
    case 3:
      return '3rem';
    case 4:
      return '4rem';
    default:
      return '1rem';
  }
};

interface StyledIconProps {
  size: number;
  variant: Variant;
  hoverVariant: Variant;
}

const StyledIcon = styled.div<StyledIconProps>`
  height: ${({ size }): string => getIconSize(size)};
  width: ${({ size }): string => getIconSize(size)};

  svg {
    color: ${({ variant }): string => getColorForVariant(variant)};
    cursor: pointer;
    height: 100%;
    width: 100%;

    &:hover {
      transform: var(--scale);
      transition: var(--transition);
      color: ${({ hoverVariant }): string => getColorForVariant(hoverVariant)};
    }
  }
`;

type IconSize = 1 | 2 | 3 | 4;

interface Props extends IconProps {
  variant?: Variant;
  hoverVariant?: Variant;
  size: IconSize;
}

export const Icon: React.FC<Props> = ({ icon: Icon, variant, hoverVariant, size, onClick }) => (
  <StyledIcon variant={variant} hoverVariant={hoverVariant} size={size} onClick={onClick}>
    <Icon />
  </StyledIcon>
);
