import { Typography } from '@material-ui/core';
import React from 'react';
import { Card } from '../containers';

interface Props {
  text?: string;
}

export const NotFoundCard: React.FC<Props> = ({ text }) => (
  <Card>
    <Typography variant="h5">
      {text ? text : 'The page you were looking for was not found...'}
    </Typography>
  </Card>
);
