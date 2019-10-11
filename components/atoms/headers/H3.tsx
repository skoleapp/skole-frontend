import styled from 'styled-components';
import { VariantProps } from '../../../interfaces';
import { getColorForVariant } from '../../../utils';

export const H3 = styled.h3<VariantProps>`
  text-shadow: var(--text-shadow);
  color: ${({ variant }): string => getColorForVariant(variant)};
`;
