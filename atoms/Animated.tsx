import styled, { AnimatedProps } from "styled-components";

export const Animated = styled.div<AnimatedProps>`
  opacity: ${props => (props.launch ? 1 : 0)};
  transition: opacity ${props => (props.time ? props.time + "s" : "0.2s")};
  background: var(--black);
`;
