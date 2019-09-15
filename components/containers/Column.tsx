import { HTMLProps } from 'react';
import styled from 'styled-components';

const breakPoints = {
  sm: '768px',
  md: '992px',
  lg: '1200px'
};

const getWidthString = (span: number): string | undefined => {
  if (!span) return;

  const width = (span / 12) * 100;
  return `width: ${width}%;`;
};

type BaseColumnFn = string | undefined;

interface Props extends HTMLProps<HTMLElement> {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

export const Column = styled.div<Props>`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  justify-content: center;
  align-items: center;

  ${({ xs }): BaseColumnFn => (xs ? getWidthString(xs) : 'width: 100%')};

  @media only screen and (min-width: ${breakPoints.sm}) {
    ${({ sm }): BaseColumnFn | 0 => sm && getWidthString(sm)};
  }

  @media only screen and (min-width: ${breakPoints.md}) {
    ${({ md }): BaseColumnFn | 0 => md && getWidthString(md)};
  }

  @media only screen and (min-width: ${breakPoints.lg}) {
    ${({ lg }): BaseColumnFn | 0 => lg && getWidthString(lg)};
  }
`;
