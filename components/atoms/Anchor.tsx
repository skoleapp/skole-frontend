import styled from 'styled-components';
import { VariantProps } from '../../interfaces';
import { getColorForVariant } from '../../utils';

export const Anchor = styled.a<VariantProps>`
  color: ${({ variant }): string => getColorForVariant(variant)};
  text-decoration: none;
  margin: 0.5rem;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
