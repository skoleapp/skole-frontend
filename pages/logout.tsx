import { Button, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { StyledCard } from '../components';
import { Layout } from '../containers';
import { withPublic } from '../utils';

const LogoutPage: NextPage = () => (
  <Layout title="Logout">
    <StyledCard>
      <Typography variant="h5">You have been logged out!</Typography>
      <Link href="/login">
        <Button variant="contained" color="primary">
          log back in
        </Button>
      </Link>
    </StyledCard>
  </Layout>
);

export default withPublic(LogoutPage);
