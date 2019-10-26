import { Typography } from '@material-ui/core';
import React from 'react';
import { Card } from '../atoms';

interface Props {
  text?: string;
}

export const NotFoundCard: React.FC<Props> = ({ text }) => (
  <Card>
    {text ? (
      <Typography variant="h3">{text}</Typography>
    ) : (
      <Typography variant="h3">The page you were looking for was not found...</Typography>
    )}
  </Card>
);
