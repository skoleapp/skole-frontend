import styled, { FlexBoxProps } from 'styled-components';

export const Flexbox = styled.div<FlexBoxProps>`
  display: flex;
  justify-content: ${(props): string | undefined => props.justifyContent};
  align-items: ${(props): string | undefined => props.alignItems};
  align-content: ${(props): string | undefined => props.alignContent};
  width: ${(props): string | undefined => props.width};
  flex-direction: ${(props): string | undefined => props.flexDirection};
`;
