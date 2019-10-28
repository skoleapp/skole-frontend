import { Typography } from '@material-ui/core';
import React from 'react';
import { Card } from '../atoms';

interface Props {
  text?: string;
}

export const NotFoundCard: React.FC<Props> = ({ text }) => (
  <Card>
    {text ? (
      <Typography variant="h5">{text}</Typography>
    ) : (
      <Typography variant="h5">The page you were looking for was not found...</Typography>
    )}
  </Card>
);
