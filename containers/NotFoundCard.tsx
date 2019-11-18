import { Typography } from '@material-ui/core';
import React from 'react';
import { StyledCard } from '../components';

interface Props {
  text: string;
}

export const NotFoundCard: React.FC<Props> = ({ text }) => (
  <StyledCard>
    <Typography variant="h5">{text}</Typography>
  </StyledCard>
);
