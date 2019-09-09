import styled from 'styled-components';

interface Props {
  launch: boolean;
  time?: number;
}

export const AnimatedDiv = styled.div<Props>`
  opacity: ${(props): number => (props.launch ? 1 : 0)};
  transition: opacity ${(props): string => (props.time ? props.time + 's' : '0.2s')};
`;
