import { Button, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { Anchor, Card, MainLayout } from '../components';
import { withPublic } from '../lib';

const LogoutPage: NextPage = () => (
  <MainLayout title="Login">
    <Card>
      <Typography variant="h3">You have been logged out!</Typography>
      <Link href="/login">
        <Anchor>
          <Button variant="contained" color="primary">
            log back in
          </Button>
        </Anchor>
      </Link>
    </Card>
  </MainLayout>
);

export default withPublic(LogoutPage);
