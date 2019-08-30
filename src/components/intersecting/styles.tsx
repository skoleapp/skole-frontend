import styled from "styled-components";

export const Animated = styled.div<{ launch: boolean; time?: number }>`
  opacity: ${props => (props.launch ? 1 : 0)};
  transition: opacity ${props => (props.time ? props.time + "s" : "0.2s")};
`;
