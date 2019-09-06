import styled from 'styled-components';

interface AnimatedProps {
  launch: boolean;
  time?: number;
}

export const Animated = styled.div<AnimatedProps>`
  opacity: ${(props): number => (props.launch ? 1 : 0)};
  transition: opacity ${(props): string => (props.time ? props.time + 's' : '0.2s')};
`;
