import styled from 'styled-components';

interface Props {
  launch: boolean;
  time?: number;
}

export const AnimatedDiv = styled.div<Props>`
  opacity: ${({ launch }): number => (launch ? 1 : 0)};
  transition: opacity ${({ time }): string => (time ? time + 's' : '0.2s')};
`;
