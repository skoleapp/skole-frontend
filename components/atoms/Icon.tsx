import React from 'react';
import styled from 'styled-components';
import { Variant, VariantProps } from '../../interfaces';
import { getColorForVariant } from '../../utils';

const StyledIcon = styled.i<VariantProps>`
  color: ${({ variant }): string => getColorForVariant(variant)};
`;

interface Props {
  iconName: string;
  variant?: Variant;
}

export const Icon: React.FC<Props> = ({ iconName, variant }) => (
  <StyledIcon variant={variant} className={`fas fa-3x fa-${iconName}`} />
);
