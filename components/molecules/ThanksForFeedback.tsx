import { Button, Typography } from '@material-ui/core';
import Router from 'next/router';
import React from 'react';

export const ThanksForFeedback: React.FC = () => (
  <>
    <Typography variant="h3">Thank you for your feedback!</Typography>
    <Button variant="contained" color="primary" onClick={(): Promise<boolean> => Router.push('/')}>
      back to home
    </Button>
  </>
);
