import React from 'react';
import styled from 'styled-components';

type IconVariant = 'white';

interface IconProps {
  variant?: IconVariant;
}

const getColorForVariant = (variant?: string): string => {
  switch (variant) {
    case 'white':
      return 'var(--white)';
    default:
      return 'var(--black)';
  }
};

const StyledIcon = styled.i<IconProps>`
  color: ${({ variant }): string | undefined => getColorForVariant(variant)};
`;

interface Props {
  iconName: string;
  variant?: IconVariant;
}

export const Icon: React.FC<Props> = ({ iconName, variant }) => (
  <StyledIcon variant={variant} className={`fas fa-3x fa-${iconName}`} />
);
