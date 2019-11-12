import { ArrowBack } from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../styles';

interface Props {
  backUrl: string;
}

export const BackArrow: React.FC<Props> = ({ backUrl }) => (
  <StyledBackArrow className="back-arrow">
    <Link href={backUrl}>
      <ArrowBack />
    </Link>
  </StyledBackArrow>
);

const StyledBackArrow = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-grow: 0.1;

  @media only screen and (max-width: ${breakpoints.SM}) {
    position: absolute;
  }

  svg {
    color: var(--secondary);
  }
`;
