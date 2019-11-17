import { Box, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../styles';

interface Props {
  text: string;
}

export const Heading: React.FC<Props> = ({ text }) => (
  <StyledLogo>
    <Typography variant="h6">{text}</Typography>
  </StyledLogo>
);

const StyledLogo = styled(Box)`
  margin: 0 0.5rem;
  flex-grow: 1;
  text-align: center;

  .MuiTypography-h6 {
    max-width: 12rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 auto;

    @media only screen and (min-width: ${breakpoints.SM}) {
      max-width: 30rem;
      margin-left: 0;
    }
  }

  @media only screen and (min-width: ${breakpoints.SM}) {
    text-align: left;
  }
`;
