import styled, { AnimatedProps } from 'styled-components';

export const Animated = styled.div<AnimatedProps>`
  opacity: ${(props): number => (props.launch ? 1 : 0)};
  transition: opacity ${(props): string => (props.time ? props.time + 's' : '0.2s')};
`;
