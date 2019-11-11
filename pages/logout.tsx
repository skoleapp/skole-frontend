import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { ButtonLink, StyledCard } from '../components';
import { Layout } from '../containers';
import { withPublic } from '../utils';

const LogoutPage: NextPage = () => (
  <Layout title="Logout">
    <StyledCard>
      <Typography variant="h5">You have been logged out!</Typography>
      <ButtonLink href="/login" variant="contained" color="primary">
        log back in
      </ButtonLink>
    </StyledCard>
  </Layout>
);

export default withPublic(LogoutPage);
