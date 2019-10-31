import { Button, Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { Card } from '../containers';

export const LogoutCard: React.FC = () => (
  <Card>
    <Typography variant="h5">You have been logged out!</Typography>
    <Link href="/login">
      <Button variant="contained" color="primary">
        log back in
      </Button>
    </Link>
  </Card>
);
