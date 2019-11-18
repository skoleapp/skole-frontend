import { Box } from '@material-ui/core';
import styled from 'styled-components';

interface Props {
  launch: boolean;
  time?: number;
  ref: any; // eslint-disable-line @eslint-typescript/no-explicit-any
}

export const AnimatedBox = styled(Box)<Props>`
  opacity: ${({ launch }): number => (launch ? 1 : 0)};
  transition: opacity ${({ time }): string => (time ? time + 's' : '0.2s')};
`;
