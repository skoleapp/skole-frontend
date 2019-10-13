import React from 'react';
import styled from 'styled-components';
import { IconProps, Variant, VariantProps } from '../../../interfaces';
import { getColorForVariant } from '../../../utils';

const StyledIcon = styled.i<VariantProps>`
  color: ${({ variant }): string => getColorForVariant(variant)};
  cursor: pointer;
`;

type IconSize = '1' | '2' | '3';

interface Props extends IconProps {
  variant?: Variant;
  iconSize: IconSize;
}

export const Icon: React.FC<Props> = ({ iconName, variant, iconSize, onClick }) => (
  <StyledIcon
    variant={variant}
    className={`fas fa-${iconSize}x fa-${iconName}`}
    onClick={onClick}
  />
);
