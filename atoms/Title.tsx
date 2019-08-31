import styled, { TitleProps } from 'styled-components';

export const Title = styled.h1<TitleProps>`
  font-family: ${(props): string => (props.font ? props.font : 'monospace')};
  font-size: ${(props): string => (props.size ? props.size + 'px' : '50px')};
  text-align: center;
`;
